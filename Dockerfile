# ---------- Stage 1: Build Go backend ----------
FROM golang:1.23 AS backend-build

WORKDIR /app

# Cache dependencies
COPY backend/go.mod backend/go.sum ./
RUN go mod download

# Copy backend source
COPY backend/ .

# Build static binary
RUN CGO_ENABLED=0 GOOS=linux go build -o /out/app ./cmd/api/main.go


# ---------- Stage 2: Build React frontend with pnpm ----------
FROM node:20 AS frontend-build

WORKDIR /app

# Enable corepack so pnpm is available
RUN corepack enable

# Copy package manager files
COPY frontend/pnpm-lock.yaml frontend/package.json ./

# Install deps
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY frontend/ .
RUN pnpm build


# ---------- Stage 3: Final runtime ----------
FROM debian:stable-slim AS runtime

WORKDIR /app

# Install minimal certs (useful for https calls)
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy Go binary
COPY --from=backend-build /out/app ./app

# Copy frontend build into /app/frontend
COPY --from=frontend-build /app/dist ./frontend

# Copy backend/public into /app/public
COPY backend/public ./public

# --- Environment variables ---
ENV FRONTEND_DIR=/app/frontend \
    IMAGES_DIR=/app/data/images \
    CONNECTION_STRING=/app/data/data.db \
    ARTICLES_DIR=/app/data/articles \
    PORT=8080

# Create directories for mounted volumes (optional)
RUN mkdir -p /app/data/images /app/data/articles

# Expose app port (adjust if needed)
EXPOSE 8080

# Run the app
CMD ["./app"]
