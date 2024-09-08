package repository

import (
	"brand-management-service/internal/model"
	"database/sql"
	"fmt"
)

func CreateTurn(turn model.Turn) error {
	if !isUserExist(turn.UserID) {
		return fmt.Errorf("user with ID %d does not exist", turn.UserID)
	}

	if !isEventExist(turn.EventID) {
		return fmt.Errorf("event with ID %d does not exist", turn.EventID)
	}

	query := "INSERT INTO turn (user_id, event_id, turn) VALUES (?, ?, ?)"
	_, err := db.Exec(query, turn.UserID, turn.EventID, 0)
	if err != nil {
		// Handle specific error if needed (e.g., unique constraint violation)
		return fmt.Errorf("failed to create turn: %w", err)
	}
	return nil
}

func Addturn(turn model.Turn) error {
	if !isUserExist(turn.UserID) {
		return fmt.Errorf("user with ID %d does not exist", turn.UserID)
	}

	if !isEventExist(turn.EventID) {
		return fmt.Errorf("event with ID %d does not exist", turn.EventID)
	}

	// Check if the turn record exists
	var existingturn int64
	queryCheck := "SELECT turn FROM turn WHERE user_id = ? AND event_id = ?"
	err := db.QueryRow(queryCheck, turn.UserID, turn.EventID).Scan(&existingturn)

	if err != nil {
		if err == sql.ErrNoRows {
			// Record does not exist, create it
			if err := CreateTurn(turn); err != nil {
				return fmt.Errorf("failed to create turn record: %w", err)
			}
		} else {
			// Error querying the database
			return fmt.Errorf("error checking if turn record exists: %w", err)
		}
	}

	// Add turns to the existing record
	newturnValue := existingturn + turn.Turn
	queryUpdate := "UPDATE turn SET turn = ? WHERE user_id = ? AND event_id = ?"
	_, err = db.Exec(queryUpdate, newturnValue, turn.UserID, turn.EventID)
	if err != nil {
		return fmt.Errorf("failed to update turn: %w", err)
	}

	return nil
}

func Subtractturn(turn model.Turn) error {
	if !isUserExist(turn.UserID) {
		return fmt.Errorf("user with ID %d does not exist", turn.UserID)
	}

	if !isEventExist(turn.EventID) {
		return fmt.Errorf("event with ID %d does not exist", turn.EventID)
	}

	// Check if the turn record exists
	var existingturn int64
	queryCheck := "SELECT turn FROM turn WHERE user_id = ? AND event_id = ?"
	err := db.QueryRow(queryCheck, turn.UserID, turn.EventID).Scan(&existingturn)

	if err != nil {
		if err == sql.ErrNoRows {
			// Record does not exist, create it
			if err := CreateTurn(turn); err != nil {
				return fmt.Errorf("failed to create turn record: %w", err)
			}
		} else {
			// Error querying the database
			return fmt.Errorf("error checking if turn record exists: %w", err)
		}
	}

	// Subtract turns to the existing record
	queryUpdate := "UPDATE turn SET turn = turn - ? WHERE user_id = ? AND event_id = ? AND turn >= ?"
	result, err := db.Exec(queryUpdate, turn.Turn, turn.UserID, turn.EventID, turn.Turn)
	if err != nil {
		return fmt.Errorf("failed to update turn: %w", err)
	}

	// Check if the update affected exactly one row
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("update failed: either no matching record or insufficient turn number")
	}

	return nil
}
