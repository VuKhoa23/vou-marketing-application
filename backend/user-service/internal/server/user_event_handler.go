package server

import (
	"brand-management-service/internal/repository"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CreateUserEventReq struct {
	UserID  int64 `json:"userId"`
	EventID int64 `json:"eventId"`
}

type UpdateUserEventReq struct {
	UserID  int64 `json:"userId"`
	EventID int64 `json:"eventId"`
	Coin    int64 `json:"coin"`
}

func (s *Server) CreateUserEventHandler(c *gin.Context) {
	var req CreateUserEventReq
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	err := repository.CreateUserEvent(req.UserID, req.EventID)
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

	err := repository.UpdateUserEvent(req.UserID, req.EventID, req.Coin)
	fmt.Printf("Request Body: %+v\n", req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user_event: " + err.Error()})
		return
	}

	// Success response
	c.JSON(http.StatusOK, gin.H{"message": "Update user_event successfully"})
}
