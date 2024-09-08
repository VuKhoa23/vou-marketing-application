package model

type UserEvent struct {
	UserID  int64 `json:"userId"`
	EventID int64 `json:"eventId"`
	Coin    int64 `json:"coin"`
	Turn    int64 `json:"turn"`
}
