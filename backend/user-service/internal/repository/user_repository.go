package repository

import (
	"brand-management-service/internal/model"
	"brand-management-service/internal/utils"
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
)

func CreateUser(user model.User) (model.User, error) {
	query := "INSERT INTO user (username, password, phone, gender, image_url) VALUES (?, ?, ?, ?, ?)"

	hashedPassword := utils.HashPassword(user.Password)

	_, err := db.Exec(query, user.Username, hashedPassword, user.Phone, user.Gender, user.ImageURL)
	if err != nil {
		return model.User{}, err
	}
	return user, nil
}

func LoginUser(user model.User) (string, error) {
	query := "SELECT * FROM user WHERE username=?"

	userFromDb := model.User{}
	row := db.QueryRow(query, user.Username)
	err := row.Scan(&userFromDb.ID, &userFromDb.Username, &userFromDb.Password, &userFromDb.Phone, &userFromDb.Gender, &userFromDb.ImageURL)
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

func GetUserInfo(userID int64) (model.User, error) {
	var user model.User
	query := "SELECT * FROM user WHERE id=?"

	err := db.QueryRow(query, userID).Scan(&user.ID, &user.Username, &user.Password, &user.Phone, &user.Gender, &user.ImageURL)
	if err != nil {
		if err == sql.ErrNoRows {
			return user, err
		}
		return user, err
	}

	return user, nil
}

func GetJsonResponse(url string, result interface{}) error {
	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	err = json.Unmarshal(body, result)
	if err != nil {
		return err
	}

	return nil
}

func PostJsonResponse(url string, requestData interface{}, result interface{}) error {
	// Marshal the request data to JSON
	jsonData, err := json.Marshal(requestData)
	if err != nil {
		return err
	}

	// Perform the POST request
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	err = json.Unmarshal(body, result)
	if err != nil {
		return err
	}

	return nil
}

func PutJsonResponse(url string, requestData interface{}, result interface{}) error {
	// Marshal the request data to JSON
	jsonData, err := json.Marshal(requestData)
	if err != nil {
		return fmt.Errorf("failed to marshal request data: %w", err)
	}

	// Perform the PUT request
	req, err := http.NewRequest(http.MethodPut, url, bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
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
		return false
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return false
	}

	var eventResponse struct {
		Event struct {
			ID int64 `json:"id"`
		} `json:"event"`
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return false
	}

	err = json.Unmarshal(body, &eventResponse)
	if err != nil {
		return false
	}

	return eventResponse.Event.ID == eventID
}

func voucherQuantitiesLeft(voucherID int64) int64 {
	baseURL := os.Getenv("API_BRAND_URL")
	url := fmt.Sprintf("%s/voucher/quantities-by-id?voucherId=%d", baseURL, voucherID)
	// url := fmt.Sprintf("http://localhost:8080/api/brand/event/find?id=%d", eventID)

	resp, err := http.Get(url)
	if err != nil {
		fmt.Printf("error checking if there is quantities exists: %v\n", err)
		return -1
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return -1
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("failed to read response body: %v\n", err)
		return -1
	}

	quantity, err := strconv.ParseInt(string(body), 10, 64)
	if err != nil {
		fmt.Printf("failed to parse response as int: %v\n", err)
		return -1
	}

	return quantity
}

func GetAllUsers() ([]model.UserGetAllResponses, error) {
	query := "SELECT id, username FROM `user`"

	rows, err := db.QueryContext(context.Background(), query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []model.UserGetAllResponses
	for rows.Next() {
		var user model.UserGetAllResponses
		if err := rows.Scan(&user.Id, &user.Username); err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return users, nil
}

func RequestTurn(requestId int64, responseId int64, eventId int64) error {
	query := "INSERT INTO `turn_request` (request_id, response_id, event_id) VALUES (?, ?, ?)"
	_, err := db.Exec(query, requestId, responseId, eventId)
	if err != nil {
		return err
	}
	return nil
}

type Turn struct {
	UserID  int64
	EventID int
}

func AcceptTurnRequest(requestId int64) error {
	query := "SELECT request_id, event_id FROM turn_request WHERE id = ?"

	var requestID int64
	var eventID int

	err := db.QueryRow(query, requestId).Scan(&requestID, &eventID)
	if err != nil {
		if err == sql.ErrNoRows {
			return fmt.Errorf("no turn request found with id %d", requestId)
		}
		return err
	}

	turn := model.Turn{
		UserID:  requestID,
		EventID: int64(eventID),
		Turn:    1,
	}

	err = Addturn(turn)
	if err != nil {
		return err
	}

	query = "UPDATE turn_request SET state = ? WHERE id = ?"
	_, err = db.Exec(query, 1, requestId)
	if err != nil {
		return err
	}
	return nil
}

func GetTurnRequest(userId int64) ([]model.TurnRequestRes, error) {
	query := "SELECT id, request_id, event_id, state FROM turn_request WHERE response_id = ?"

	rows, err := db.QueryContext(context.Background(), query, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var requests []model.TurnRequestRes
	for rows.Next() {
		var req model.TurnRequestRes
		if err := rows.Scan(&req.Id, &req.RequestId, &req.EventId, &req.State); err != nil {
			return nil, err
		}
		requests = append(requests, req)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return requests, nil
}
