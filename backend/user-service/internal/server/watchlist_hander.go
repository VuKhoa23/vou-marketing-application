package server

import (
	"brand-management-service/internal/dto"
	"brand-management-service/internal/model"
	"brand-management-service/internal/repository"
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

type AddEventToWatchlistReq struct {
	EventID int64 `json:"eventId"`
}

func (s *Server) AddEventToWatchlistHandler(c *gin.Context) {
	var req AddEventToWatchlistReq
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

	watchlist := model.Watchlist{
		UserID:  userIdInt64,
		EventID: req.EventID,
	}

	err := repository.AddEventToWatchlist(watchlist)
	fmt.Printf("Request Body: %+v\n", req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add event to watchlist: " + err.Error()})
		return
	}

	// Success response
	c.JSON(http.StatusOK, gin.H{"message": "Event added to watchlist successfully"})
}

func (s *Server) ShowWatchlistHandler(c *gin.Context) {
	baseURL := os.Getenv("API_BRAND_URL")
	url := fmt.Sprintf("%s/event/find-by-ids", baseURL)
	// url := "http://localhost:8080/api/brand/event/find-by-ids"

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

	eventIds, err := repository.ShowWatchlist(userIdInt64)
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
