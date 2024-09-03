package server

import (
	"brand-management-service/internal/dto"
	"brand-management-service/internal/repository"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type AddEventToWatchlistReq struct {
	UserID  int64 `json:"userId"`
	EventID int64 `json:"eventId"`
}

type Event struct {
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

func (s *Server) ShowWatchlistHandler(c *gin.Context) {
	url := "http://localhost:8080/api/brand/event/find-by-ids"

	userIdStr := c.Query("userId")
	if userIdStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "userId is required"})
		return
	}

	userId, err := strconv.ParseInt(userIdStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid userId format"})
		return
	}

	eventIds, err := repository.ShowWatchlist(userId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve event IDs: " + err.Error()})
		return
	}

	// Prepare the IdsDTO to send to the event service
	idsDTO := dto.IdsDTO{Ids: eventIds}

	var responseDTOs []dto.EventDTO
	err = repository.PostJsonResponse(url, idsDTO, &responseDTOs)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Error fetching data: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "OK",
		"data":    responseDTOs,
	})
}
