package repository

import (
	"brand-management-service/internal/model"
	"database/sql"
	"fmt"
	"os"
)

func CreateUserVoucher(userVoucher model.UserVoucher) error {
	if !isUserExist(userVoucher.UserID) {
		return fmt.Errorf("user with ID %d does not exist", userVoucher.UserID)
	}

	query := "INSERT INTO user_voucher (user_id, voucher_id, voucher_quantities) VALUES (?, ?, ?)"
	_, err := db.Exec(query, userVoucher.UserID, userVoucher.VoucherID, 0)
	if err != nil {
		// Handle specific error if needed (e.g., unique constraint violation)
		return err
	}
	return nil
}

func AddVoucher(userVoucher model.UserVoucher) error {
	if !isUserExist(userVoucher.UserID) {
		return fmt.Errorf("user with ID %d does not exist", userVoucher.UserID)
	}

	if voucherQuantitiesLeft(userVoucher.VoucherID) < userVoucher.VoucherQuantities {
		return fmt.Errorf("voucher with ID %d does not have enough quantities", userVoucher.VoucherID)
	}

	// Check if the voucher record exists
	var existingVoucher int64
	queryCheck := "SELECT voucher_quantities FROM user_voucher WHERE user_id = ? AND voucher_id = ?"
	err := db.QueryRow(queryCheck, userVoucher.UserID, userVoucher.VoucherID).Scan(&existingVoucher)

	if err != nil {
		if err == sql.ErrNoRows {
			// Record does not exist, create it
			if err := CreateUserVoucher(userVoucher); err != nil {
				return err
			}
		} else {
			// Error querying the database
			return err
		}
	}

	// Add voucher
	newVoucherQuantities := existingVoucher + userVoucher.VoucherQuantities
	queryVoucherUpdate := "UPDATE user_voucher SET voucher_quantities = ? WHERE user_id = ? AND voucher_id = ?"
	_, err = db.Exec(queryVoucherUpdate, newVoucherQuantities, userVoucher.UserID, userVoucher.VoucherID)
	if err != nil {
    return err

	// Prepare data for the updateVoucher API
	updateData := map[string]interface{}{
		"voucherId":  userVoucher.VoucherID,
		"quantities": userVoucher.VoucherQuantities,
	}

	// Call the updateVoucher API to subtract quantities
	baseURL := os.Getenv("API_BRAND_URL")
	url := fmt.Sprintf("%s/voucher/subtract-by-id?voucherId=%d&quantities=%d", baseURL, userVoucher.VoucherID, userVoucher.VoucherQuantities)
	PutJsonResponse(url, updateData, nil)

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
			return 0, err
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
