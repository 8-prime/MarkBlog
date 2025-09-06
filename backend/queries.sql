-- Article CRUD Operations
-- name: CreateArticle :one
INSERT INTO
    articles (title, description, body, scheduled_at)
VALUES
    (?, ?, ?, ?) RETURNING id,
    created_at;