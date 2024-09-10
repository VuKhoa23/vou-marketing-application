package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func (s *Server) RegisterRoutes() http.Handler {
	r := gin.Default()
	r.Use(corsMiddleware())

	r.GET("/api/user-management/get-all", s.getAllUserHandler)
	r.POST("/api/user-management/create", s.createUserHandler)
	r.PUT("/api/user-management/update", s.updateUserHandler)
	r.DELETE("/api/user-management/delete", s.deleteUserHandler)

	return r
}
