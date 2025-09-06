package database

import "os"

type DatabaseSettings struct {
	connection string
}

func NewDatabaseSettings() *DatabaseSettings {

	conn, found := os.LookupEnv("CONNECTION_STRING")
	if !found {
		return &DatabaseSettings{
			connection: ":memory:",
		}
	}
	return &DatabaseSettings{
		connection: conn,
	}
}
