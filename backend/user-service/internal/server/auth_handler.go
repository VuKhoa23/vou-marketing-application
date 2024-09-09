package server

import (
	"brand-management-service/internal/model"
	"brand-management-service/internal/repository"
	"net/http"

	"github.com/gin-gonic/gin"
)

type RegisterReq struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Phone    string `json:"phone"`
	Gender   string `json:"gender"`
	ImageURL string `json:"imageURL"`
}

type LoginReq struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func (s Server) registerHandler(c *gin.Context) {
	var req RegisterReq
	err := c.ShouldBindJSON(&req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}
	user, err := repository.CreateUser(model.User{
		Username: req.Username,
		Password: req.Password,
		Phone:    req.Phone,
		Gender:   req.Gender,
		ImageURL: req.ImageURL,
	})
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
	var req LoginReq
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
