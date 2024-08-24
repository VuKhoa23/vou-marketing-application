package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (s *Server) RegisterRoutes() http.Handler {
	r := gin.Default()

	r.GET("/api/brand-management/get-all", s.getAllBrandHandler)

	r.POST("/api/brand-management/create", s.createBrandHandler)

	r.POST("/api/brand-management/disable/:brandId", s.disableBrandHandler)

	r.POST("/api/brand-management/enable/:brandId", s.enableBrandHandler)

	return r
}
