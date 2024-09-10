package server

import (
	"brand-management-service/internal/repository"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
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
