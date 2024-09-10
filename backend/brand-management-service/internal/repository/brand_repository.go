package repository

import (
	"brand-management-service/internal/model"
	"database/sql"
)

func GetAllBrands() ([]model.Brand, error) {
	var brands []model.Brand
	rows, err := db.Query("SELECT id, username, category, address, long, lat, state FROM brand")
	if err != nil {
		return []model.Brand{}, err
	}
	defer rows.Close()
	for rows.Next() {
		var id sql.NullInt16
		var username sql.NullString
		var category sql.NullString
		var address sql.NullString
		var long sql.NullString
		var lat sql.NullString
		var state []byte // Use []byte to handle bit fields
		if err := rows.Scan(&id, &username, &category, &address, &long, &lat, &state); err != nil {
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

		brands = append(brands, model.Brand{
			Username: username.String,
			ID:       id.Int16,
			Category: category.String,
			Address:  address.String,
			Long:     long.String,
			Lat:      lat.String,
			State:    stateValue,
		})
	}
	return brands, nil
}

func CreateBrand(brand model.Brand) (model.Brand, error) {
	query := "INSERT INTO brand (username, password, category, address, long, lat, state) VALUES (?, ?, ?, ?, ?, ?, ?)"
	state := 0
	if brand.State == true {
		state = 1
	}
	_, err := db.Exec(query, brand.Username, brand.Password, brand.Category, brand.Address, brand.Long, brand.Lat, state)
	if err != nil {
		return model.Brand{}, err
	}
	return brand, nil
}

func DisableBrand(id int) error {
	query := "UPDATE brand SET state = ? WHERE id = ?"
	_, err := db.Exec(query, 0, id)
	if err != nil {
		return err
	}
	return nil
}

func EnableBrand(id int) error {
	query := "UPDATE brand SET state = ? WHERE id = ?"
	_, err := db.Exec(query, 1, id)
	if err != nil {
		return err
	}
	return nil
}
