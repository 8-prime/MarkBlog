-- +goose Up
-- +goose StatementBegin
CREATE TABLE articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    filename TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    scheduled_at DATETIME,
    published_at DATETIME,
    deleted_at DATETIME
);

CREATE TABLE article_reads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_id INTEGER NOT NULL REFERENCES articles(id),
    read_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (name TEXT PRIMARY KEY);

CREATE TABLE article_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_id INTEGER NOT NULL REFERENCES articles(id),
    tag_name TEXT NOT NULL REFERENCES tags(name)
);

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE article_tags;

DROP TABLE tags;

DROP TABLE article_reads;

DROP TABLE articles;

-- +goose StatementEnd