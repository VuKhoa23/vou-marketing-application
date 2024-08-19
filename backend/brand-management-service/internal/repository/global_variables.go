package repository

import "brand-management-service/internal/database"

var (
	dbService = database.New()
	db        = dbService.DB()
)
