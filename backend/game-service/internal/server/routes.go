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
	// -------- GAMES APIs --------
	r.POST("/api/game", s.createGameHandler)

	r.PUT("/api/game", s.editGameHandler)

	r.GET("/api/game/by-event/:eventId", s.getGameByEventIdHandler)

	r.GET("/api/game/:id", s.getGameHandler)

	r.GET("/api/game", s.getAllGames)

	// -------- QUESTIONS APIs --------
	r.POST("/api/game/create-question", s.createQuestionHandler)

	r.GET("/api/game/get-questions/:gameId", s.getAllQuestionsByGameIdHandler)

	// -------- ANSWER APIs ---------

	r.POST("/api/game/create-answers", s.createAnswersHandler)

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
