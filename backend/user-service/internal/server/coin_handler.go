package server

import (
	"brand-management-service/internal/model"
	"brand-management-service/internal/repository"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UpdateCoinReq struct {
	EventID int64 `json:"eventId"`
	Coin    int64 `json:"coin"`
}

func (s *Server) AddCoinHandler(c *gin.Context) {
	var req UpdateCoinReq
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
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

	// Call the UpdateCoin function
	if err := repository.AddCoin(model.Coin{
		UserID:  userIDInt64,
		EventID: req.EventID,
		Coin:    req.Coin,
	}); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update coin: " + err.Error()})
		return
	}

	// Success response
	c.JSON(http.StatusOK, gin.H{"message": "Coin record updated successfully"})
}

// UpdateCoinHandler handles the HTTP request for updating coin records
func (s *Server) SubtractCoinHandler(c *gin.Context) {
	var req UpdateCoinReq
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
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

	// Call the UpdateCoin function
	if err := repository.SubtractCoin(model.Coin{
		UserID:  userIDInt64,
		EventID: req.EventID,
		Coin:    req.Coin,
	}); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update coin: " + err.Error()})
		return
	}

	// Success response
	c.JSON(http.StatusOK, gin.H{"message": "Coin record updated successfully"})
}
