package server

import (
	"brand-management-service/internal/repository"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CreateUserEventReq struct {
	EventID int64 `json:"eventId"`
}

type UpdateUserEventReq struct {
	EventID int64 `json:"eventId"`
	NewCoin int64 `json:"newCoin"`
}

func (s *Server) CreateUserEventHandler(c *gin.Context) {
	var req CreateUserEventReq
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	userId, exists := c.Get("id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "unauthorized",
		})
		return
	}

	// Convert userId to int64 if it's an int16
	var userIdInt64 int64
	switch id := userId.(type) {
	case int64:
		userIdInt64 = id
	case int16:
		userIdInt64 = int64(id) // Convert int16 to int64
	default:
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID type"})
		return
	}

	err := repository.CreateUserEvent(userIdInt64, req.EventID)
	fmt.Printf("Request Body: %+v\n", req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user_event: " + err.Error()})
		return
	}

	// Success response
	c.JSON(http.StatusOK, gin.H{"message": "Create user_event successfully"})
}

func (s *Server) UpdateUserEventHandler(c *gin.Context) {
	var req UpdateUserEventReq
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	userId, exists := c.Get("id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "unauthorized",
		})
		return
	}

	// Convert userId to int64 if it's an int16
	var userIdInt64 int64
	switch id := userId.(type) {
	case int64:
		userIdInt64 = id
	case int16:
		userIdInt64 = int64(id) // Convert int16 to int64
	default:
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID type"})
		return
	}

	err := repository.UpdateUserEvent(userIdInt64, req.EventID, req.NewCoin)
	fmt.Printf("Request Body: %+v\n", req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user_event: " + err.Error()})
		return
	}

	// Success response
	c.JSON(http.StatusOK, gin.H{"message": "Update user_event successfully"})
}
