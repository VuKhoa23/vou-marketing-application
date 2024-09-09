package model

type Coin struct {
	UserID  int64 `json:"userId"`
	EventID int64 `json:"eventId"`
	Coin    int64 `json:"coin"`
}
