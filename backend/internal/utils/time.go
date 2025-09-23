package utils

import (
	"database/sql"
	"time"
)

func TimeFromDb(dbTime sql.NullTime) *time.Time {
	if dbTime.Valid {
		return &dbTime.Time
	}
	return nil
}
