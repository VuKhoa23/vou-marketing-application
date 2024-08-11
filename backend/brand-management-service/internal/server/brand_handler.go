package server

import (
	"brand-management-service/internal/model"
	"brand-management-service/internal/repository"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"net/http"
)

type BrandReq struct {
	Username string  `json:"username"`
	Password string  `json:"password"`
	Category *string `json:"category"`
	State    bool    `json:"state"`
}

func (s *Server) getAllBrandHandler(c *gin.Context) {
	var brands []model.Brand
	brands, err := repository.GetAllBrands()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}
	if len(brands) == 0 {
		c.JSON(http.StatusOK, make([]string, 0))
		return
	}
	c.JSON(http.StatusOK, brands)
}

func (s *Server) createBrandHandler(c *gin.Context) {
	var req BrandReq
	err := c.ShouldBindJSON(&req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	if req.Category == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "category is required",
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
	_, err = repository.CreateBrand(model.Brand{Username: req.Username, Category: *req.Category, Password: string(hashedPassword), State: req.State})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully created brand",
	})
}
