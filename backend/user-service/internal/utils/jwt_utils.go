package utils

import (
	"brand-management-service/internal/constants"
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"time"
)

func CreateToken(ID int16, username string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256,
		jwt.MapClaims{
			"username": username,
			"id":       ID,
			"exp":      time.Now().Add(time.Hour * 1000).Unix(),
		})

	tokenString, err := token.SignedString([]byte(constants.JWT_SERCRET))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func VerifyToken(tokenString string) (int16, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(constants.JWT_SERCRET), nil
	})
	if err != nil {
		return 0, err
	}

	if !token.Valid {
		return 0, fmt.Errorf("invalid token")
	}

	claims := token.Claims.(jwt.MapClaims)
	idClaim, ok := claims["id"].(float64)
	if !ok {
		return 0, fmt.Errorf("id claim is missing or not a number")
	}
	id := int16(idClaim)

	return id, nil
}
