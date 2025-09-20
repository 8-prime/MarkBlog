-- Article CRUD Operations
-- name: CreateArticle :one
INSERT INTO
    articles (title, description, body, scheduled_at)
VALUES
    (?, ?, ?, ?) RETURNING id;

-- Create tag
-- name: Tag :exec
INSERT
    OR IGNORE INTO tags (name)
VALUES
    (?);

-- name: CreateArticleTag :exec
INSERT INTO
    article_tags (article_id, tag_name)
VALUES
    (?, ?);

-- name: GetArticle :one
SELECT
    id,
    title,
    description,
    body,
    created_at,
    updated_at,
    scheduled_at,
    published_at,
    deleted_at
FROM
    articles
WHERE
    id = ?
LIMIT
    1;

-- name: GetArticleInfos :many
SELECT
    id,
    title,
    description,
    created_at,
    updated_at,
    scheduled_at,
    published_at,
FROM
    articles -- name: ClearArticleTags :exec
DELETE FROM
    article_tags
WHERE
    article_id = ?;