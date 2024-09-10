package server

import (
	"net/http"
	"strconv"
	"user-management-service/internal/model"
	"user-management-service/internal/repository"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type userReq struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Phone    string `json:"phone"`
	Gender   string `json:"gender"`
	ImageURL string `json:"image_url"`
}

func (s *Server) getAllUserHandler(c *gin.Context) {
	var users []model.User
	users, err := repository.GetAllUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}
	if len(users) == 0 {
		c.JSON(http.StatusOK, make([]string, 0))
		return
	}
	c.JSON(http.StatusOK, users)
}

func (s *Server) createUserHandler(c *gin.Context) {
	var req userReq
	err := c.ShouldBindJSON(&req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Something went wrong: " + err.Error(),
		})
		return
	}
	_, err = repository.CreateUser(model.User{Username: req.Username, Password: string(hashedPassword), Phone: req.Phone, Gender: req.Gender, ImageURL: req.ImageURL})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully created user",
	})
}

func (s *Server) updateUserHandler(c *gin.Context) {
	var req userReq
	err := c.ShouldBindJSON(&req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	userID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid user ID",
		})
		return
	}

	_, err = repository.UpdateUser(model.User{
		ID:       int16(userID),
		Username: req.Username,
		Phone:    req.Phone,
		Gender:   req.Gender,
		ImageURL: req.ImageURL,
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully updated user",
	})
}

func (s *Server) deleteUserHandler(c *gin.Context) {
	userID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid user ID",
		})
		return
	}

	err = repository.DeleteUser(int16(userID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully deleted user",
	})
}
