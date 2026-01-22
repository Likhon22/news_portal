package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/bcrypt"

	"news-portal-backend/internal/adapter/storage/db"
)

func main() {
	name := flag.String("name", "", "Admin name")
	email := flag.String("email", "", "Admin email")
	password := flag.String("password", "", "Admin password")
	flag.Parse()

	if *name == "" || *email == "" || *password == "" {
		fmt.Println("Usage: go run cmd/admin/main.go -name=\"Name\" -email=\"email@example.com\" -password=\"password\"")
		os.Exit(1)
	}

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL environment variable is required")
	}

	ctx := context.Background()
	dbPool, err := pgxpool.New(ctx, dbURL)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v", err)
	}
	defer dbPool.Close()

	// Hash password
	hash, err := bcrypt.GenerateFromPassword([]byte(*password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("Failed to hash password: %v", err)
	}

	// Direct DB creation since we are removing the service method
	queries := db.New(dbPool)
	owner, err := queries.CreateOwner(ctx, db.CreateOwnerParams{
		Name:         *name,
		Email:        *email,
		PasswordHash: string(hash),
	})
	if err != nil {
		log.Fatalf("Failed to create admin: %v", err)
	}

	fmt.Printf("Successfully created admin: %s (ID: %s)\n", owner.Name, owner.ID)
}
