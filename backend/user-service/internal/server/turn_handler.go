package server

import (
	"brand-management-service/internal/model"
	"brand-management-service/internal/repository"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type UpdateTurnReq struct {
	EventID int64 `json:"eventId"`
	Turn    int64 `json:"turn"`
}

func (s *Server) AddTurnHandler(c *gin.Context) {
	var req UpdateTurnReq
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	userID, exists := c.Get("id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	// Convert userID to int64 if necessary
	var userIDInt64 int64
	switch id := userID.(type) {
	case int64:
		userIDInt64 = id
	case int16:
		userIDInt64 = int64(id)
	default:
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID type"})
		return
	}

	if err := repository.Addturn(model.Turn{
		UserID:  userIDInt64,
		EventID: req.EventID,
		Turn:    req.Turn,
	}); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}

	// Success response
	c.JSON(http.StatusOK, gin.H{"message": "turn record updated successfully"})
}

func (s *Server) SubtractTurnHandler(c *gin.Context) {
	var req UpdateTurnReq
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	userID, exists := c.Get("id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	var userIDInt64 int64
	switch id := userID.(type) {
	case int64:
		userIDInt64 = id
	case int16:
		userIDInt64 = int64(id)
	default:
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID type"})
		return
	}

	if err := repository.Subtractturn(model.Turn{
		UserID:  userIDInt64,
		EventID: req.EventID,
		Turn:    req.Turn,
	}); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}

	// Success response
	c.JSON(http.StatusOK, gin.H{"message": "turn record updated successfully"})
}

func (s *Server) GetTurnsHandler(c *gin.Context) {
	userID, exists := c.Get("id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	// Convert userID to int64 if necessary
	var userIDInt64 int64
	switch id := userID.(type) {
	case int64:
		userIDInt64 = id
	case int16:
		userIDInt64 = int64(id)
	default:
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID type"})
		return
	}

	eventIDStr := c.Query("eventId")
	eventID, err := strconv.ParseInt(eventIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	turnAmount, err := repository.ShowTurn(userIDInt64, eventID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}

	c.JSON(http.StatusOK, gin.H{"turn": turnAmount})
}
