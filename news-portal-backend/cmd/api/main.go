package main

import (
	"context"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"strings"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"

	"news-portal-backend/internal/adapter/handler"
	customMiddleware "news-portal-backend/internal/adapter/middleware"
	"news-portal-backend/internal/adapter/storage"
	"news-portal-backend/internal/core/port"
	"news-portal-backend/internal/core/service"
)

func main() {
	// 0. Load .env file if present
	_ = godotenv.Load()

	// 1. Logger Setup
	appEnv := os.Getenv("APP_ENV")
	var logger *slog.Logger
	if appEnv == "production" {
		logger = slog.New(slog.NewJSONHandler(os.Stdout, nil))
	} else {
		logger = slog.New(slog.NewTextHandler(os.Stdout, nil))
	}
	slog.SetDefault(logger)

	// 2. Config Loading
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		logger.Error("DATABASE_URL is required")
		os.Exit(1)
	}
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		logger.Error("JWT_SECRET is required")
		os.Exit(1)
	}
	serverPort := os.Getenv("PORT")
	if serverPort == "" {
		logger.Error("PORT is required")
		os.Exit(1)
	}

	// CORS Config
	corsOrigins := os.Getenv("CORS_ALLOWED_ORIGINS")
	if corsOrigins == "" {
		corsOrigins = "*" // Default/Dev fallback
		logger.Warn("CORS_ALLOWED_ORIGINS not set, allowing all origins")
	}
	allowedOrigins := strings.Split(corsOrigins, ",")

	// Rate Limit Config
	rpsStr := os.Getenv("RATE_LIMIT_RPS")
	burstStr := os.Getenv("RATE_LIMIT_BURST")
	rps, _ := strconv.ParseFloat(rpsStr, 64)
	burst, _ := strconv.Atoi(burstStr)
	if rps == 0 {
		rps = 10
	}
	if burst == 0 {
		burst = 30
	}

	// 3. Database
	ctx := context.Background()
	dbPool, err := pgxpool.New(ctx, dbURL)
	if err != nil {
		logger.Error("Unable to connect to database", "error", err)
		os.Exit(1)
	}
	defer dbPool.Close()

	// 4. Adapters & Services
	store := storage.NewAdapter(dbPool)
	authService := service.NewAuthService(store, jwtSecret)
	categoryService := service.NewCategoryService(store)
	newsService := service.NewNewsService(store, store)

	// File Service (R2 Enforced)
	r2AccountID := os.Getenv("R2_ACCOUNT_ID")
	r2AccessKey := os.Getenv("R2_ACCESS_KEY_ID")
	r2SecretKey := os.Getenv("R2_SECRET_ACCESS_KEY")
	r2Bucket := os.Getenv("R2_BUCKET_NAME")
	r2PublicURL := os.Getenv("R2_PUBLIC_URL")

	if r2AccountID == "" || r2AccessKey == "" || r2SecretKey == "" || r2Bucket == "" {
		logger.Error("R2 configuration missing")
		os.Exit(1)
	}

	r2Service, err := service.NewR2Service(r2AccountID, r2AccessKey, r2SecretKey, r2Bucket, r2PublicURL)
	if err != nil {
		logger.Error("Failed to initialize R2 service", "error", err)
		os.Exit(1)
	}
	var fileService port.FileService = r2Service
	logger.Info("Using Cloudflare R2 Storage", "bucket", r2Bucket)

	// Handlers
	authHandler := handler.NewAuthHandler(authService)
	categoryHandler := handler.NewCategoryHandler(categoryService)
	newsHandler := handler.NewNewsHandler(newsService)
	fileHandler := handler.NewFileHandler(fileService)

	// Stats
	statsService := service.NewStatsService(store, store, store)
	statsHandler := handler.NewStatsHandler(statsService)

	// 5. Router & Middleware
	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger) // Chi's default logger is okay for dev, but for prod maybe replace with custom slog middleware (Day 2)
	r.Use(middleware.Recoverer)

	// Security Middleware
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   allowedOrigins,
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))
	r.Use(customMiddleware.RateLimitMiddleware(rps, burst))

	// Routes
	r.Route("/api/v1", func(r chi.Router) {
		r.Post("/auth/login", authHandler.Login)
		r.Get("/categories", categoryHandler.ListCategories)
		r.Get("/news", newsHandler.ListNews)
		r.Get("/news/homepage", newsHandler.GetHomepage)
		r.Get("/news/check-slug", newsHandler.CheckSlug)
		r.Get("/news/{slug}", newsHandler.GetNews)
		r.Get("/stats", statsHandler.GetStats)

		r.Group(func(r chi.Router) {
			r.Use(handler.AuthMiddleware(jwtSecret))
			r.Post("/upload", fileHandler.Upload)
			r.Post("/news", newsHandler.CreateNews)
			r.Put("/news/{id}", newsHandler.UpdateNews)
			r.Delete("/news/{id}", newsHandler.DeleteNews)
		})
	})

	// 6. Graceful Shutdown Setup
	srv := &http.Server{
		Addr:    ":" + serverPort,
		Handler: r,
	}

	// Run server in a goroutine
	go func() {
		logger.Info("Server starting", "port", serverPort, "env", appEnv)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Error("Server failed", "error", err)
			os.Exit(1)
		}
	}()

	// Wait for interrupt signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	logger.Info("Shutting down server...")

	// Create a deadline to wait for.
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		logger.Error("Server forced to shutdown", "error", err)
	}

	logger.Info("Server exiting")
}

// FileServer conveniently sets up a http.FileServer handler at a given path.
func FileServer(r chi.Router, path string, root http.FileSystem) {
	if strings.ContainsAny(path, "{}*") {
		panic("FileServer does not permit any URL parameters.")
	}

	if path != "/" && path[len(path)-1] != '/' {
		r.Get(path, http.RedirectHandler(path+"/", 301).ServeHTTP)
		path += "/"
	}
	path += "*"

	r.Get(path, func(w http.ResponseWriter, r *http.Request) {
		rctx := chi.RouteContext(r.Context())
		pathPrefix := strings.TrimSuffix(rctx.RoutePattern(), "/*")
		fs := http.StripPrefix(pathPrefix, http.FileServer(root))
		fs.ServeHTTP(w, r)
	})
}
