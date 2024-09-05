package server

import (
	"brand-management-service/internal/middleware"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (s *Server) RegisterRoutes() http.Handler {
	r := gin.Default()

	r.POST("/api/user/auth/register", s.registerHandler)
	r.POST("/api/user/auth/login", s.loginHandler)
	r.GET("/api/user/public", s.publicHandler)
	r.GET("/api/user/protected", middleware.AuthenticationMiddleware, s.protectedHandler)
	return r
}
