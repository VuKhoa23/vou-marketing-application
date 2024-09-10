package repository

import (
	"database/sql"
	"user-management-service/internal/model"
)

func GetAllUsers() ([]model.User, error) {
	var users []model.User
	rows, err := db.Query("SELECT id, username, phone, gender, image_url FROM user")
	if err != nil {
		return []model.User{}, err
	}
	defer rows.Close()
	for rows.Next() {
		var id sql.NullInt16
		var username sql.NullString
		var phone sql.NullString
		var gender sql.NullString
		var image_url sql.NullString
		if err := rows.Scan(&id, &username, &phone, &gender, &image_url); err != nil {
			return []model.User{}, err
		}

		users = append(users, model.User{
			ID:       id.Int16,
			Username: username.String,
			Phone:    phone.String,
			Gender:   gender.String,
			ImageURL: image_url.String,
		})
	}
	return users, nil
}

func CreateUser(user model.User) (model.User, error) {
	query := "INSERT INTO user (username, password, phone, gender, image_url) VALUES (?, ?, ?, ?, ?)"

	_, err := db.Exec(query, user.Username, user.Password, user.Phone, user.Gender, user.ImageURL)
	if err != nil {
		return model.User{}, err
	}
	return user, nil
}

func UpdateUser(user model.User) (model.User, error) {
	query := `UPDATE user SET username = ?, phone = ?, gender = ?, image_url = ? WHERE id = ?`

	_, err := db.Exec(query, user.Username, user.Phone, user.Gender, user.ImageURL, user.ID)
	if err != nil {
		return model.User{}, err
	}
	return user, nil
}

func DeleteUser(userID int16) error {
	query := `DELETE FROM user WHERE id = ?`

	_, err := db.Exec(query, userID)
	if err != nil {
		return err
	}
	return nil
}
