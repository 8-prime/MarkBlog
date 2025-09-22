package database

import "os"

type DatabaseSettings struct {
	Connection string
}

func NewDatabaseSettings() *DatabaseSettings {

	conn, found := os.LookupEnv("CONNECTION_STRING")
	if !found {
		return &DatabaseSettings{
			Connection: ":memory:",
		}
	}
	return &DatabaseSettings{
		Connection: conn,
	}
}
