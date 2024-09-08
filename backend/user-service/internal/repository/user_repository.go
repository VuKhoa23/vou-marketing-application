package repository

import (
	"brand-management-service/internal/model"
	"brand-management-service/internal/utils"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

func CreateUser(user model.User) (model.User, error) {
	query := "INSERT INTO user (username, password, phone, gender) VALUES (?, ?, ?, ?)"

	hashedPassword := utils.HashPassword(user.Password)

	_, err := db.Exec(query, user.Username, hashedPassword, user.Phone, user.Gender)
	if err != nil {
		return model.User{}, err
	}
	return user, nil
}

func LoginUser(user model.User) (string, error) {
	query := "SELECT * FROM user WHERE username=?"

	userFromDb := model.User{}
	row := db.QueryRow(query, user.Username)
	err := row.Scan(&userFromDb.ID, &userFromDb.Username, &userFromDb.Password, &userFromDb.Phone, &userFromDb.Gender)
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

func GetJsonResponse(url string, result interface{}) error {
	resp, err := http.Get(url)
	if err != nil {
		return fmt.Errorf("failed to make request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read response body: %w", err)
	}

	err = json.Unmarshal(body, result)
	if err != nil {
		return fmt.Errorf("failed to unmarshal JSON response: %w", err)
	}

	return nil
}

func PostJsonResponse(url string, requestData interface{}, result interface{}) error {
	// Marshal the request data to JSON
	jsonData, err := json.Marshal(requestData)
	if err != nil {
		return fmt.Errorf("failed to marshal request data: %w", err)
	}

	// Perform the POST request
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("failed to make request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read response body: %w", err)
	}

	err = json.Unmarshal(body, result)
	if err != nil {
		return fmt.Errorf("failed to unmarshal JSON response: %w", err)
	}

	return nil
}

func isUserExist(userID int64) bool {
	query := "SELECT COUNT(*) FROM user WHERE id = ?"
	var count int
	err := db.QueryRow(query, userID).Scan(&count)
	if err != nil {
		return false
	}
	return count > 0
}

func isEventExist(eventID int64) bool {
	baseURL := os.Getenv("API_BRAND_URL")
	url := fmt.Sprintf("%s/event/find?id=%d", baseURL, eventID)
	// url := fmt.Sprintf("http://localhost:8080/api/brand/event/find?id=%d", eventID)

	resp, err := http.Get(url)
	if err != nil {
		fmt.Printf("error checking if event exists: %v\n", err)
		return false
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return false
	}

	var eventResponse struct {
		ID int64 `json:"id"`
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("failed to read response body: %v\n", err)
		return false
	}

	err = json.Unmarshal(body, &eventResponse)
	if err != nil {
		fmt.Printf("failed to unmarshal JSON response: %v\n", err)
		return false
	}

	return eventResponse.ID == eventID
}
