package server

import (
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
