package server

import (
	"brand-management-service/internal/model"
	"brand-management-service/internal/repository"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type BrandReq struct {
	Username string  `json:"username"`
	Password string  `json:"password"`
	Category *string `json:"category"`
	Lon      string  `json:"lon"`
	Lat      string  `json:"lat"`
	State    bool    `json:"state"`
}

func (s *Server) getAllBrandHandler(c *gin.Context) {
	var brands []model.Brand
	brands, err := repository.GetAllBrands()
	fmt.Println(brands)
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
	_, err = repository.CreateBrand(model.Brand{Username: req.Username, Category: *req.Category, Password: string(hashedPassword), Lon: req.Lon, Lat: req.Lat, State: req.State})

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

func (s *Server) disableBrandHandler(c *gin.Context) {
	brandId, err := strconv.Atoi(c.Param("brandId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Cannot disable brand: " + err.Error(),
		})
	}
	err = repository.DisableBrand(brandId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully disabled brand: " + c.Param("brandId"),
	})
}

func (s *Server) enableBrandHandler(c *gin.Context) {
	brandId, err := strconv.Atoi(c.Param("brandId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Cannot enable brand: " + err.Error(),
		})
	}
	err = repository.EnableBrand(brandId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully enabled brand: " + c.Param("brandId"),
	})
}

func (s *Server) updateBrandHandler(c *gin.Context) {
	brandId, err := strconv.Atoi(c.Param("brandId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Cannot update brand: " + err.Error(),
		})
	}

	var req model.UpdateBrandRequest
	err = c.ShouldBindJSON(&req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	err = repository.UpdateBrand(int64(brandId), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully update brand: " + c.Param("brandId"),
	})
}

func (s *Server) deleteBrandhandler(c *gin.Context) {
	brandId, err := strconv.Atoi(c.Param("brandId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Cannot update brand: " + err.Error(),
		})
	}

	err = repository.DeleteBrand(brandId)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully delete brand: " + c.Param("brandId"),
	})
}
