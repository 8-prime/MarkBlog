# ---------- Stage 1: Build Go backend ----------
FROM golang:1.25 AS backend-build

WORKDIR /app

# Cache dependencies
COPY backend/go.mod backend/go.sum ./
RUN go mod download

RUN go install github.com/a-h/templ/cmd/templ@latest
RUN go install github.com/sqlc-dev/sqlc/cmd/sqlc@latest

# Copy backend source
COPY backend/ .

# Generate code from SQL queries
RUN sqlc generate .\sqlc.yml

# Generate HTML templates
RUN templ generate .\internal\views\

# Build static binary
RUN CGO_ENABLED=0 GOOS=linux go build -o /out/app ./cmd/api/main.go


# ---------- Stage 2: Build React frontend with pnpm ----------
FROM node:24 AS frontend-build

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
FROM alpine:3.20 AS runtime

WORKDIR /app

# Add certs for HTTPS calls
RUN apk --no-cache add ca-certificates

# Copy Go binary
COPY --from=backend-build /out/app ./app

# Copy frontend build
COPY --from=frontend-build /app/dist ./frontend

# Copy backend/public
COPY backend/public ./public

# Environment variables
ENV FRONTEND_DIR=/app/frontend \
        IMAGES_DIR=/app/data/images \
        CONNECTION_STRING=/app/data/data.db \
        ARTICLES_DIR=/app/data/articles \
        AUTH_ENABLED=true \
        IS_PROD=true \
        PORT=8080

# Create data dirs
RUN mkdir -p /app/data/images /app/data/articles

EXPOSE 8080

CMD ["./app"]