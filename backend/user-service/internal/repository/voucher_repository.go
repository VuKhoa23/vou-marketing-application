package repository

import (
	"brand-management-service/internal/model"
	"database/sql"
	"fmt"
)

func CreateUserVoucher(userVoucher model.UserVoucher) error {
	if !isUserExist(userVoucher.UserID) {
		return fmt.Errorf("user with ID %d does not exist", userVoucher.UserID)
	}

	query := "INSERT INTO user_voucher (user_id, voucher_id, voucher_quantities) VALUES (?, ?, ?)"
	_, err := db.Exec(query, userVoucher.UserID, userVoucher.VoucherID, 0)
	if err != nil {
		// Handle specific error if needed (e.g., unique constraint violation)
		return fmt.Errorf("failed to create voucher for user: %w", err)
	}
	return nil
}

func AddVoucher(userVoucher model.UserVoucher) error {
	if !isUserExist(userVoucher.UserID) {
		return fmt.Errorf("user with ID %d does not exist", userVoucher.UserID)
	}

	// Check if the voucher record exists
	var existingVoucher int64
	queryCheck := "SELECT voucher_quantities FROM user_voucher WHERE user_id = ? AND voucher_id = ?"
	err := db.QueryRow(queryCheck, userVoucher.UserID, userVoucher.VoucherID).Scan(&existingVoucher)

	if err != nil {
		if err == sql.ErrNoRows {
			// Record does not exist, create it
			if err := CreateUserVoucher(userVoucher); err != nil {
				return fmt.Errorf("failed to create voucher record: %w", err)
			}
		} else {
			// Error querying the database
			return fmt.Errorf("error checking if voucher record exists: %w", err)
		}
	}

	// Add voucher
	newVoucherQuantities := existingVoucher + userVoucher.VoucherQuantities
	queryVoucherUpdate := "UPDATE user_voucher SET voucher_quantities = ? WHERE user_id = ? AND voucher_id = ?"
	_, err = db.Exec(queryVoucherUpdate, newVoucherQuantities, userVoucher.UserID, userVoucher.VoucherID)
	if err != nil {
		return fmt.Errorf("failed to update voucher quantities: %w", err)
	}

	return nil
}

func ShowVoucher(userID int64, voucherID int64) (int64, error) {
	if !isUserExist(userID) {
		return 0, fmt.Errorf("user with ID %d does not exist", userID)
	}

	// Check if the voucher record exists
	var existingVoucher int64
	queryCheck := "SELECT voucher_quantities FROM user_voucher WHERE user_id = ? AND voucher_id = ?"
	err := db.QueryRow(queryCheck, userID, voucherID).Scan(&existingVoucher)

	if err != nil {
		if err == sql.ErrNoRows {
			// Record does not exist, create it
			newVoucher := model.UserVoucher{
				UserID:            userID,
				VoucherID:         voucherID,
				VoucherQuantities: 0, // Default voucher amount
			}
			CreateUserVoucher(newVoucher)
		} else {
			// Error querying the database
			return 0, fmt.Errorf("error checking if voucher record exists: %w", err)
		}
	}

	var voucherAmount int64
	query := `SELECT voucher_quantities FROM user_voucher WHERE user_id = ? AND voucher_id = ?`
	row := db.QueryRow(query, userID, voucherID)
	err = row.Scan(&voucherAmount)
	if err != nil {
		if err == sql.ErrNoRows {
			return 0, nil // No record found
		}
		return 0, err // Other errors
	}

	return voucherAmount, nil
}
