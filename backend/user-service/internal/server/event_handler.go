package server

import (
	"brand-management-service/internal/dto"
	"brand-management-service/internal/repository"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (s *Server) getAllEventsHandler(c *gin.Context) {
	url := "http://localhost:8080/api/brand/event/find-all"

	var responseDTOs []dto.EventAndVoucherDTO
	err := repository.GetJsonResponse(url, &responseDTOs)
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

func (s *Server) getEventsByBrandHandler(c *gin.Context) {
	brandId := c.Query("brandId")
	if brandId == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Missing 'brandId' query parameter",
		})
		return
	}

	url := fmt.Sprintf("http://localhost:8080/api/brand/event/events-and-vouchers?brandId=%s", brandId)

	var responseDTOs []dto.EventAndVoucherDTO
	err := repository.GetJsonResponse(url, &responseDTOs)
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
