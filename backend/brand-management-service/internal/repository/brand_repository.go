package repository

import (
	"brand-management-service/internal/model"
	"database/sql"
)

func GetAllBrands() ([]model.Brand, error) {
	var brands []model.Brand
	rows, err := db.Query("SELECT id, name, category, state FROM brand")
	if err != nil {
		return []model.Brand{}, err
	}
	defer rows.Close()
	for rows.Next() {
		var id sql.NullInt16
		var username sql.NullString
		var category sql.NullString
		var state []byte // Use []byte to handle bit fields
		if err := rows.Scan(&id, &username, &category, &state); err != nil {
			return []model.Brand{}, err
		}
		var stateValue bool
		if len(state) > 0 {
			temp := int(state[0])
			// Assuming the bit field is a single byte (e.g., 0x00 or 0x01)
			if temp == 1 {
				stateValue = true
			} else {
				stateValue = false
			}

		}

		brands = append(brands, model.Brand{Username: username.String, ID: id.Int16, Category: category.String, State: stateValue})
	}
	return brands, nil
}

func CreateBrand(brand model.Brand) (model.Brand, error) {
	query := "INSERT INTO brand (username, password, category, state) VALUES (?, ?, ?, ?)"
	state := 0
	if brand.State == true {
		state = 1
	}
	_, err := db.Exec(query, brand.Username, brand.Password, brand.Category, state)
	if err != nil {
		return model.Brand{}, err
	}
	return brand, nil
}
