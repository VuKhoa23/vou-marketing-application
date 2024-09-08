package server

import (
	"brand-management-service/internal/middleware"
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

	r.POST("/api/user/auth/register", s.registerHandler)
	r.POST("/api/user/auth/login", s.loginHandler)
	r.GET("/api/user/public", s.publicHandler)
	r.GET("/api/user/protected", middleware.AuthenticationMiddleware, s.protectedHandler)

	r.POST("/api/user/watchlist/add", middleware.AuthenticationMiddleware, s.AddEventToWatchlistHandler)
	r.GET("/api/user/watchlist", middleware.AuthenticationMiddleware, s.ShowWatchlistHandler)

	r.POST("/api/user/add-coin", middleware.AuthenticationMiddleware, s.AddCoinHandler)
	r.POST("/api/user/subtract-coin", middleware.AuthenticationMiddleware, s.SubtractCoinHandler)

	r.POST("/api/user/add-turn", middleware.AuthenticationMiddleware, s.AddTurnHandler)
	r.POST("/api/user/subtract-turn", middleware.AuthenticationMiddleware, s.SubtractTurnHandler)
	return r
}
