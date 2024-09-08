package model

type UserVoucher struct {
	UserID   int64 `json:"userId"`
	EventIDs int64 `json:"eventId"`
	Coin     int64 `json:"coin"`
	Turn     int64 `json:"turn"`
}
