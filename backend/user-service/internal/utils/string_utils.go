package utils

import "golang.org/x/crypto/bcrypt"

func HashPassword(str string) string {
	bytes, _ := bcrypt.GenerateFromPassword([]byte(str), 14)
	return string(bytes)
}

func CompareHashAndPassword(hashedPassword, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	return err == nil
}
