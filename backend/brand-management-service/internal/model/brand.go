package model

type Brand struct {
	ID       int16  `gorm:"primary_key" json:"id"`
	Username string `json:"username,omitempty"`
	Password string `json:"password,omitempty"`
	Category string `json:"category,omitempty"`
	State    bool   `json:"state"`
}
