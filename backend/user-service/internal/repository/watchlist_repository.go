package repository

import (
	"brand-management-service/internal/model"
	"fmt"
)

func AddEventToWatchlist(watchlist model.Watchlist) error {
	if !isUserExist(watchlist.UserID) {
		return fmt.Errorf("user with ID %d does not exist", watchlist.UserID)
	}

	if !isEventExist(watchlist.EventID) {
		return fmt.Errorf("event with ID %d does not exist", watchlist.EventID)
	}

	query := "INSERT INTO watchlist (user_id, event_id) VALUES (?, ?)"
	_, err := db.Exec(query, watchlist.UserID, watchlist.EventID)
	if err != nil {
		// Handle specific error if needed (e.g., unique constraint violation)
		return fmt.Errorf("failed to add event to watchlist: %w", err)
	}
	return nil
}

func ShowWatchlist(userID int64) ([]int64, error) {
	if !isUserExist(userID) {
		return nil, fmt.Errorf("user with ID %d does not exist", userID)
	}

	query := "SELECT event_id FROM watchlist WHERE user_id = ?"
	rows, err := db.Query(query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch watchlist: %w", err)
	}
	defer rows.Close()

	var watchlist []int64
	for rows.Next() {
		var eventID int64
		if err := rows.Scan(&eventID); err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}
		watchlist = append(watchlist, eventID)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error occurred during row iteration: %w", err)
	}
	return watchlist, nil
}
