package server

import (
	"brand-management-service/internal/model"
	"brand-management-service/internal/repository"
	"github.com/gin-gonic/gin"
	"net/http"
)

type AuthReq struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func (s Server) registerHandler(c *gin.Context) {
	var req AuthReq
	err := c.ShouldBindJSON(&req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}
	user, err := repository.CreateUser(model.User{Username: req.Username, Password: req.Password})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "OK",
		"data":    user,
	})
}

func (s Server) loginHandler(c *gin.Context) {
	var req AuthReq
	err := c.ShouldBindJSON(&req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}
	token, err := repository.LoginUser(model.User{Username: req.Username, Password: req.Password})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	if token == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Bad credentials",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":     "Success",
		"accessToken": "Bearer " + token,
	})
}
