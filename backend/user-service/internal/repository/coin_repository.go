package repository

import (
	"brand-management-service/internal/model"
	"database/sql"
	"fmt"
)

func CreateCoin(coin model.Coin) error {
	if !isUserExist(coin.UserID) {
		return fmt.Errorf("user with ID %d does not exist", coin.UserID)
	}

	if !isEventExist(coin.EventID) {
		return fmt.Errorf("event with ID %d does not exist", coin.EventID)
	}

	query := "INSERT INTO coin (user_id, event_id, coin) VALUES (?, ?, ?)"
	_, err := db.Exec(query, coin.UserID, coin.EventID, 0)
	if err != nil {
		// Handle specific error if needed (e.g., unique constraint violation)
		return fmt.Errorf("failed to create coin: %w", err)
	}
	return nil
}

func AddCoin(coin model.Coin) error {
	if !isUserExist(coin.UserID) {
		return fmt.Errorf("user with ID %d does not exist", coin.UserID)
	}

	if !isEventExist(coin.EventID) {
		return fmt.Errorf("event with ID %d does not exist", coin.EventID)
	}

	// Check if the coin record exists
	var existingCoin int64
	queryCheck := "SELECT coin FROM coin WHERE user_id = ? AND event_id = ?"
	err := db.QueryRow(queryCheck, coin.UserID, coin.EventID).Scan(&existingCoin)

	if err != nil {
		if err == sql.ErrNoRows {
			// Record does not exist, create it
			if err := CreateCoin(coin); err != nil {
				return fmt.Errorf("failed to create coin record: %w", err)
			}
		} else {
			// Error querying the database
			return fmt.Errorf("error checking if coin record exists: %w", err)
		}
	}

	// Add coins to the existing record
	newCoinValue := existingCoin + coin.Coin
	queryUpdate := "UPDATE coin SET coin = ? WHERE user_id = ? AND event_id = ?"
	_, err = db.Exec(queryUpdate, newCoinValue, coin.UserID, coin.EventID)
	if err != nil {
		return fmt.Errorf("failed to update coin: %w", err)
	}

	return nil
}

func SubtractCoin(coin model.Coin) error {
	if !isUserExist(coin.UserID) {
		return fmt.Errorf("user with ID %d does not exist", coin.UserID)
	}

	if !isEventExist(coin.EventID) {
		return fmt.Errorf("event with ID %d does not exist", coin.EventID)
	}

	// Check if the coin record exists
	var existingCoin int64
	queryCheck := "SELECT coin FROM coin WHERE user_id = ? AND event_id = ?"
	err := db.QueryRow(queryCheck, coin.UserID, coin.EventID).Scan(&existingCoin)

	if err != nil {
		if err == sql.ErrNoRows {
			// Record does not exist, create it
			if err := CreateCoin(coin); err != nil {
				return fmt.Errorf("failed to create coin record: %w", err)
			}
		} else {
			// Error querying the database
			return fmt.Errorf("error checking if coin record exists: %w", err)
		}
	}

	// Subtract coins to the existing record
	queryUpdate := "UPDATE coin SET coin = coin - ? WHERE user_id = ? AND event_id = ? AND coin >= ?"
	result, err := db.Exec(queryUpdate, coin.Coin, coin.UserID, coin.EventID, coin.Coin)
	if err != nil {
		return fmt.Errorf("failed to update coin: %w", err)
	}

	// Check if the update affected exactly one row
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("update failed: either no matching record or insufficient coin balance")
	}

	return nil
}
