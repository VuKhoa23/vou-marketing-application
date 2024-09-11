package server

import (
	"brand-management-service/internal/model"
	"brand-management-service/internal/repository"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
)

func (s Server) publicHandler(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "public",
	})
}

func (s Server) protectedHandler(c *gin.Context) {
	isAuthenticated, exists := c.Get("isAuthenticated")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "unauthorized",
		})
		return
	}

	// get ID information from auth middleware
	id, exists := c.Get("id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "unauthorized",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "protected",
		"data":    isAuthenticated,
		"userId":  id,
	})
}

func (s Server) GetUserInfoHandler(c *gin.Context) {
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

	fmt.Println("id ", userIdInt64)
	user, err := repository.GetUserInfo(userIdInt64)
	if err != nil {
		if err.Error() == fmt.Sprintf("user with ID %d not found", userIdInt64) {
			c.JSON(http.StatusNotFound, gin.H{"error": err})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		}
		return
	}

	c.JSON(http.StatusOK, user)
}

func (s *Server) GetAllUserHandler(c *gin.Context) {
	users, err := repository.GetAllUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err})
		return
	}

	c.JSON(http.StatusOK, users)
}

func (s *Server) RequestTurnHandler(c *gin.Context) {
	userId, _ := c.Get("id")

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

	var req model.UserRequestCoinReq
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	err := repository.RequestTurn(userIdInt64, req.TargetId, req.EventId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	c.JSON(200, gin.H{
		"message": "OK",
	})
}

func (s *Server) AcceptTurnHandler(c *gin.Context) {
	var req model.AcceptTurnReq
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	err := repository.AcceptTurnRequest(req.Id)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}
	c.JSON(200, gin.H{
		"message": "OK",
	})
}

func (s *Server) GetTurnRequestHandler(c *gin.Context) {
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

	requests, err := repository.GetTurnRequest(userIdInt64)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, requests)
}
