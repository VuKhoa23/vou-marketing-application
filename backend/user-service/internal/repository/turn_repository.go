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
	_, err := db.Exec(query, turn.UserID, turn.EventID, 10)
	if err != nil {
		// Handle specific error if needed (e.g., unique constraint violation)
		return err
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
				return err
			}
		} else {
			// Error querying the database
			return err
		}
	}

	// Add turns to the existing record
	newturnValue := existingturn + turn.Turn
	queryUpdate := "UPDATE turn SET turn = ? WHERE user_id = ? AND event_id = ?"
	_, err = db.Exec(queryUpdate, newturnValue, turn.UserID, turn.EventID)
	if err != nil {
		return err
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
				return err
			}
		} else {
			// Error querying the database
			return err
		}
	}

	// Subtract turns to the existing record
	queryUpdate := "UPDATE turn SET turn = turn - ? WHERE user_id = ? AND event_id = ? AND turn >= ?"
	result, err := db.Exec(queryUpdate, turn.Turn, turn.UserID, turn.EventID, turn.Turn)
	if err != nil {
		return err
	}

	// Check if the update affected exactly one row
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return fmt.Errorf("Either no matching record or insufficient turn number")
	}

	return nil
}

func ShowTurn(userID int64, eventID int64) (int64, error) {
	if !isUserExist(userID) {
		return 0, fmt.Errorf("user with ID %d does not exist", userID)
	}

	if !isEventExist(eventID) {
		return 0, fmt.Errorf("event with ID %d does not exist", eventID)
	}

	// Check if the turn record exists
	var existingTurn int64
	queryCheck := "SELECT turn FROM turn WHERE user_id = ? AND event_id = ?"
	err := db.QueryRow(queryCheck, userID, eventID).Scan(&existingTurn)

	if err != nil {
		if err == sql.ErrNoRows {
			// Record does not exist, create it
			newTurn := model.Turn{
				UserID:  userID,
				EventID: eventID,
				Turn:    10, // Default turn amount
			}
			CreateTurn(newTurn)
		} else {
			// Error querying the database
			return 0, err
		}
	}

	var turnAmount int64
	query := `SELECT turn FROM turn WHERE user_id = ? AND event_id = ?`
	row := db.QueryRow(query, userID, eventID)
	err = row.Scan(&turnAmount)
	if err != nil {
		if err == sql.ErrNoRows {
			return 0, nil // No record found
		}
		return 0, err // Other errors
	}

	return turnAmount, nil
}
