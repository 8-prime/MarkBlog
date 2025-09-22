-- Article CRUD Operations
-- name: CreateArticle :one
INSERT INTO
    articles (title, filename, description, body)
VALUES
    (?, ?, ?, ?) RETURNING ID;

-- name: UpdateArticle :exec
UPDATE
    articles
SET
    title = ?,
    filename = ?,
    description = ?,
    body = ?,
    updated_at = CURRENT_TIMESTAMP,
    scheduled_at = ?,
    published_at = ?
WHERE
    id = ?;

-- Create tag
-- name: CreateTag :exec
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

-- name: GetArticleTags :many
SELECT
    tag_name
FROM
    article_tags
WHERE
    article_id = ?;

-- name: GetArticleInfos :many
SELECT
    id,
    title,
    filename,
    description,
    created_at,
    updated_at,
    scheduled_at,
    published_at
FROM
    articles
LIMIT
    ? OFFSET ?;

-- name: ClearArticleTags :exec
DELETE FROM
    article_tags
WHERE
    article_id = ?;

-- name: AddArticleRead :exec
INSERT INTO
    article_reads (article_id)
SELECT
    id
FROM
    articles
WHERE
    filename = ?;

-- name: SetArticleDeleted :exec
UPDATE
    articles
SET
    deleted_at = CURRENT_TIMESTAMP
WHERE
    id = ?;