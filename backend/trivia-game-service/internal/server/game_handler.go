package server

import (
	"game-service/internal/model"
	"game-service/internal/repository"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"net/http"
	"strconv"
	"time"
)

func (s *Server) getGameHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "Game Get Id: " + c.Param("id"),
	})
}

type GameReq struct {
	ID        primitive.ObjectID `json:"id,omitempty"`
	EventId   int                `json:"event_id,omitempty"`
	StartTime string             `json:"start_time,omitempty"`
}

// POST - /api/game
func (s *Server) createGameHandler(c *gin.Context) {
	var req GameReq
	err := c.ShouldBindJSON(&req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "No data was found",
		})
		return
	}
	req.ID = primitive.NilObjectID
	parsed, err := time.Parse("2006-01-02 15:04:05", req.StartTime)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid start time",
		})
		return
	}
	toBeAdded := model.Game{EventId: req.EventId, StartTime: parsed, ID: primitive.NilObjectID}
	game, err := repository.CreateGame(toBeAdded)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Cannot create game " + err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, game)
}

func (s *Server) getGameByEventIdHandler(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("eventId"))
	var games []model.Game
	games, err := repository.GetAllGamesByEventId(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Cannot get all games",
		})
		return
	}
	c.JSON(http.StatusOK, games)
}

func (s *Server) editGameHandler(c *gin.Context) {
	var req GameReq
	err := c.ShouldBindJSON(&req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "No data was found",
		})
		return
	}

	parsed, err := time.Parse("2006-01-02 15:04:05", req.StartTime)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid start time",
		})
		return
	}

	toBeEdit := model.Game{EventId: req.EventId, StartTime: parsed, ID: req.ID}
	game, err := repository.EditGame(toBeEdit)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Cannot edit game: " + err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, game)
}
