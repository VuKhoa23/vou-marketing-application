package model

type Brand struct {
	ID       int16  `gorm:"primary_key" json:"id"`
	Username string `json:"username,omitempty"`
	Password string `json:"password,omitempty"`
	Category string `json:"category,omitempty"`
	Address  string `json:"address,omitempty"`
	Lon      string `json:"lon,omitempty"`
	Lat      string `json:"lat,omitempty"`
	State    bool   `json:"state"`
}

type UpdateBrandRequest struct {
	Category string `json:"category,omitempty"`
	Address  string `json:"address,omitempty"`
	Lon      string `json:"lon,omitempty"`
	Lat      string `json:"lat,omitempty"`
}
