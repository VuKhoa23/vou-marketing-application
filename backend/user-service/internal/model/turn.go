package model

type Turn struct {
	UserID  int64 `json:"userId"`
	EventID int64 `json:"eventId"`
	Turn    int64 `json:"turn"`
}
