package model

type User struct {
	ID       int16  `gorm:"primary_key" json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
	Phone    string `json:"phone"`
	Gender   string `json:"gender"`
	ImageURL string `json:"image_url"`
}
