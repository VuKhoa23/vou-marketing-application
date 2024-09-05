package middleware

import (
	"brand-management-service/internal/utils"
	"errors"
	"github.com/gin-gonic/gin"
	"strings"
)

func extractBearerToken(header string) (string, error) {
	if header == "" {
		return "", errors.New("bad header value given")
	}

	jwtToken := strings.Split(header, " ")
	if len(jwtToken) != 2 {
		return "", errors.New("incorrectly formatted authorization header")
	}

	return jwtToken[1], nil
}

func AuthenticationMiddleware(c *gin.Context) {
	token := c.GetHeader("Authorization")

	extractedToken, err := extractBearerToken(token)
	if err != nil {
		c.Next()
	}

	id, err := utils.VerifyToken(extractedToken)
	if err != nil {
		c.Next()
	}

	c.Set("isAuthenticated", true)
	c.Set("id", id)
	c.Next()
}
