package server

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func (s *Server) RegisterRoutes() http.Handler {
	r := gin.Default()

	r.GET("/api/game/hello", s.HelloWorldHandler)

	r.GET("/api/game/health", s.healthHandler)

	r.POST("/api/game", s.addGameHandler)

	r.GET("/api/game/byEvent/:id", s.getAllGamesByEventIdHandler)

	r.GET("/api/game/:id", s.getGameHandler)
	return r
}

func (s *Server) HelloWorldHandler(c *gin.Context) {
	resp := make(map[string]string)
	resp["message"] = "Hello World " + os.Getenv("DB_HOST")

	c.JSON(http.StatusOK, resp)
}

func (s *Server) healthHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Good health"})
}
