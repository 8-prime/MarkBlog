-- +goose Up
-- +goose StatementBegin
CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO settings (key, value) VALUES ('theme', 'terminal');
INSERT INTO settings (key, value) VALUES ('theme_version', strftime('%s', 'now'));
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE settings;
-- +goose StatementEnd
