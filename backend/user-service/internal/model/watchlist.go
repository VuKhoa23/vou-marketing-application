package model

type Watchlist struct {
	UserID   int64 `json:"userId"`
	EventIDs int64 `json:"eventId"`
}
