package server

import (
	"brand-management-service/internal/repository"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AddEventToWatchlistReq struct {
	UserID  int64 `json:"userId"`
	EventID int64 `json:"eventId"`
}

func (s *Server) AddEventToWatchlistHandler(c *gin.Context) {
	var req AddEventToWatchlistReq
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	err := repository.AddEventToWatchlist(req.UserID, req.EventID)
	fmt.Printf("Request Body: %+v\n", req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add event to watchlist: " + err.Error()})
		return
	}

	// Success response
	c.JSON(http.StatusOK, gin.H{"message": "Event added to watchlist successfully"})
}
