package repository

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func AddEventToWatchlist(userID int64, eventID int64) error {
	if !isUserExist(userID) {
		return fmt.Errorf("user with ID %d does not exist", userID)
	}

	if !isEventExist(eventID) {
		return fmt.Errorf("event with ID %d does not exist", eventID)
	}

	query := "INSERT INTO watchlist (user_id, event_id) VALUES (?, ?)"
	_, err := db.Exec(query, userID, eventID)
	if err != nil {
		// Handle specific error if needed (e.g., unique constraint violation)
		return fmt.Errorf("failed to add event to watchlist: %w", err)
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
	url := fmt.Sprintf("http://localhost:8080/api/brand/event/find?id=%d", eventID)

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
	fmt.Printf("response body: %s\n", string(body))

	err = json.Unmarshal(body, &eventResponse)
	if err != nil {
		fmt.Printf("failed to unmarshal JSON response: %v\n", err)
		return false
	}

	return eventResponse.ID == eventID
}
