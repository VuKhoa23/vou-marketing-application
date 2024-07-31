package server

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func (s *Server) getGameHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "Game Get Id: " + c.Param("id"),
	})
}

type GameReq struct {
	Data string `json:"data"`
}

func (s *Server) addGameHandler(c *gin.Context) {
	var req GameReq
	err := c.ShouldBindJSON(&req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "No data was found",
		})
		return
	}
	c.JSON(http.StatusOK, req)
}
