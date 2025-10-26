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
    id,
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
ORDER BY
    published_at DESC
LIMIT
    ? OFFSET ?;

-- name: GetAdminArticleInfos :many
SELECT
    id,
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

-- name: GetArticleReadSummary :one
SELECT
    CAST(MIN(read_at) as TEXT) as first_read,
    CAST(MAX(read_at) as TEXT) as last_read,
    COUNT(*) as total_reads
FROM
    article_reads
WHERE
    article_id = ?;

-- name: GetArticleReadsOverTime :many
WITH time_range AS (
    SELECT
        MIN(read_at) as first_read,
        MAX(read_at) as last_read,
        (
            CAST(strftime('%s', MAX(read_at)) AS INTEGER) - CAST(strftime('%s', MIN(read_at)) AS INTEGER)
        ) / 100 as bucket_seconds
    FROM
        article_reads
    WHERE
        article_id = sqlc.arg(article_id)
)
SELECT
    CAST(
        datetime(
            (
                CAST(strftime('%s', ar.read_at) AS INTEGER) / tr.bucket_seconds
            ) * tr.bucket_seconds,
            'unixepoch'
        ) AS TEXT
    ) as bucket_time,
    COUNT(*) as read_count
FROM
    article_reads ar
    CROSS JOIN time_range tr
WHERE
    ar.article_id = sqlc.arg(article_id)
    AND tr.bucket_seconds > 0
GROUP BY
    bucket_time
ORDER BY
    bucket_time;