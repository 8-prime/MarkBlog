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
    filename,
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

-- name: GetScheduledArticleTimes :many
SELECT
    id,
    scheduled_at
FROM
    articles
WHERE
    scheduled_at IS NOT NULL
    AND scheduled_at > CURRENT_TIMESTAMP
    OR (published_at IS NULL)
    AND deleted_at IS NULL;

-- name: PublishArticle :exec
UPDATE
    articles
SET
    published_at = CURRENT_TIMESTAMP
WHERE
    id = ?;

-- name: GetArticleTitle :one
SELECT
    title
FROM
    articles
WHERE
    id = ?;

-- name: GetPublishedArticleInfos :many
SELECT
    filename,
    title,
    description,
    published_at,
    updated_at
FROM
    articles
WHERE
    published_at < CURRENT_TIMESTAMP
    AND deleted_at IS NULL
LIMIT
    ? OFFSET ?;

-- name: GetAdminArticleInfos :many
SELECT
    id,
    filename,
    title,
    description,
    published_at,
    updated_at,
    scheduled_at
FROM
    articles
WHERE
    deleted_at IS NULL
LIMIT
    ? OFFSET ?;