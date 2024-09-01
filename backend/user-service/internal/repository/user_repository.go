package repository

import (
	"brand-management-service/internal/model"
	"brand-management-service/internal/utils"
)

func CreateUser(user model.User) (model.User, error) {
	query := "INSERT INTO user (username, password, state) VALUES (?, ?, ?)"

	hashedPassword := utils.HashPassword(user.Password)

	_, err := db.Exec(query, user.Username, hashedPassword, 1)
	if err != nil {
		return model.User{}, err
	}
	return user, nil
}

func LoginUser(user model.User) (string, error) {
	query := "SELECT * FROM user WHERE username=?"

	userFromDb := model.User{}
	row := db.QueryRow(query, user.Username)
	err := row.Scan(&userFromDb.ID, &userFromDb.Username, &userFromDb.Password, &userFromDb.State)
	if err != nil {
		return "", err
	}

	if !utils.CompareHashAndPassword(userFromDb.Password, user.Password) {
		return "", nil
	}
	token, err := utils.CreateToken(userFromDb.ID, userFromDb.Username)
	if err != nil {
		return "", err
	}
	return token, nil
}
