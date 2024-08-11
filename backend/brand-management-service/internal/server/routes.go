package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (s *Server) RegisterRoutes() http.Handler {
	r := gin.Default()

	r.GET("/", s.HelloWorldHandler)

	r.GET("/api/brand-management/get-all", s.getAllBrandHandler)

	r.POST("/api/brand-management/create", s.createBrandHandler)

	r.PATCH("/api/brand-management/disable/:brandId", s.disableBrandHandler)

	r.PATCH("/api/brand-management/enable/:brandId", s.enableBrandHandler)

	return r
}

func (s *Server) HelloWorldHandler(c *gin.Context) {
	resp := make(map[string]string)
	resp["message"] = "Hello World"

	c.JSON(http.StatusOK, resp)
}
