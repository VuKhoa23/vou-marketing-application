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
	_, err := db.Exec(query, userVoucher.UserID, userVoucher.VoucherId, 0)
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

	// Check if the coin record exists
	var existingVoucher int64
	queryCheck := "SELECT voucher_quantities FROM user_voucher WHERE user_id = ? AND voucher_id = ?"
	err := db.QueryRow(queryCheck, userVoucher.UserID, userVoucher.VoucherId).Scan(&existingVoucher)

	if err != nil {
		if err == sql.ErrNoRows {
			// Record does not exist, create it
			if err := CreateUserVoucher(userVoucher); err != nil {
				return fmt.Errorf("failed to create coin record: %w", err)
			}
		} else {
			// Error querying the database
			return fmt.Errorf("error checking if coin record exists: %w", err)
		}
	}

	// Add voucher
	newVoucherQuantities := existingVoucher + userVoucher.VoucherQuantities
	queryVoucherUpdate := "UPDATE user_voucher SET voucher_quantities = ? WHERE user_id = ? AND voucher_id = ?"
	_, err = db.Exec(queryVoucherUpdate, newVoucherQuantities, userVoucher.UserID, userVoucher.VoucherId)
	if err != nil {
		return fmt.Errorf("failed to update voucher quantities: %w", err)
	}

	return nil
}
