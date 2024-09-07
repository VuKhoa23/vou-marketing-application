package repository

import (
	"database/sql"
	"fmt"
)

func CreateUserEvent(userID int64, eventID int64) error {
	if !isUserExist(userID) {
		return fmt.Errorf("user with ID %d does not exist", userID)
	}

	if !isEventExist(eventID) {
		return fmt.Errorf("event with ID %d does not exist", eventID)
	}

	coin := int64(0)
	turn := int64(10)

	query := "INSERT INTO watchlist (user_id, event_id, coin, turn) VALUES (?, ?, ?, ?)"
	_, err := db.Exec(query, userID, eventID, coin, turn)
	if err != nil {
		// Handle specific error if needed (e.g., unique constraint violation)
		return fmt.Errorf("failed to create user_event: %w", err)
	}
	return nil
}

func UpdateUserEvent(userID int64, eventID int64, coin int64) error {
	if !isUserExist(userID) {
		return fmt.Errorf("user with ID %d does not exist", userID)
	}

	if !isEventExist(eventID) {
		return fmt.Errorf("event with ID %d does not exist", eventID)
	}

	var existingCoin int64
	var existingTurn int64
	query := "SELECT coin, turn FROM watchlist WHERE user_id = ? AND event_id = ?"
	row := db.QueryRow(query, userID, eventID)
	err := row.Scan(&existingCoin, &existingTurn)

	if err == sql.ErrNoRows {
		return fmt.Errorf("no record found for user ID %d and event ID %d", userID, eventID)
	} else if err != nil {
		return fmt.Errorf("failed to query record: %w", err)
	}

	turn := existingTurn - 1

	updateQuery := "UPDATE watchlist SET coin = ?, turn = ? WHERE user_id = ? AND event_id = ?"

	result, err := db.Exec(updateQuery, coin, turn, userID, eventID)
	if err != nil {
		return fmt.Errorf("failed to update user_event details: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to check affected rows: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("no records updated, user or event may not exist")
	}

	return nil
}
