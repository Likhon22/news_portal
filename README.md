# Modern News Portal Ecosystem

A high-performance, full-stack news portal built with a **Go** backend, **Next.js** frontend, and a dedicated **Next.js CMS** for administrators.

## 🏗 Architecture Overview

The project is divided into three main services:

1.  **Backend (`/news-portal-backend`)**:
    *   **Language**: Go (Golang)
    *   **Framework**: Chi Router
    *   **Database**: PostgreSQL
    *   **Features**: Multipart news creation with atomic image uploads to Cloudflare R2, HTML sanitization, JWT authentication, and dashboard statistics.

2.  **Frontend (`/frontend`)**:
    *   **Framework**: Next.js (App Router)
    *   **Styling**: Tailwind CSS
    *   **Data Fetching**: TanStack Query
    *   **Features**: Responsive news archive, infinite scrolling, category filtering, and trending news sidebars.

3.  **CMS (`/news-cms`)**:
    *   **Framework**: Next.js (App Router)
    *   **Styling**: Shadcn UI + Tailwind CSS
    *   **Features**: News management (Create/Edit/Delete) with Rich Text (TipTap), Category management, Admin user management, and interactive analytics charts.

---

## 🚀 Quick Start with Docker

The easiest way to get the entire ecosystem running is using Docker Compose.

### 1. Prerequisites
*   Docker and Docker Compose installed.
*   A Cloudflare R2 bucket (or any S3-compatible storage) for image uploads.

### 2. Configure Environment
Create a `.env` file in the root directory (or ensure the ones in subdirectories are set up). The Docker Compose file will pull values from your environment.

### 3. Start the Ecosystem
From the root directory, run:
```bash
docker compose up --build
```

### 4. Access the Services
*   **Main Frontend**: [http://localhost:3000](http://localhost:3000)
*   **Admin CMS**: [http://localhost:3001](http://localhost:3001)
*   **Backend API**: [http://localhost:8080/api/v1](http://localhost:8080/api/v1)

---

## 🛠 Manual Development

If you prefer to run services manually for development:

### Backend
```bash
cd news-portal-backend
go mod download
make run # Starts the API at :8080
```

### CMS
```bash
cd news-cms
npm install
npm run dev # Starts the CMS at :3001 (configured via env)
```

### Frontend
```bash
cd frontend
npm install
npm run dev # Starts the Frontend at :3000
```

---

## 🔐 Security & Features

*   **Atomic Transactions**: News and images are saved together. If the database save fails, no "ghost" image is left in your R2 bucket.
*   **Sanitized HTML**: The backend uses `bluemonday` to safely allow rich text styling (bold, colors, alignment) while blocking malicious scripts.
*   **High Performance**: Next.js standalone builds and Go's compiled binary ensure minimal memory footprint and fast response times.

---

## 📝 Credentials
To create your first admin user, use the backend CLI:
```bash
cd news-portal-backend
make create-admin NAME="Admin" EMAIL="admin@news.com" PASSWORD="your_password"
```
