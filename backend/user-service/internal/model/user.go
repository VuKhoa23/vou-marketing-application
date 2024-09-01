package model

type User struct {
	ID       int16  `gorm:"primary_key" json:"id"`
	Username string `json:"username,omitempty"`
	Password string `json:"password,omitempty"`
}
