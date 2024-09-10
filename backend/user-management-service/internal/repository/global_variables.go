package repository

import "user-management-service/internal/database"

var (
	dbService = database.New()
	db        = dbService.DB()
)
