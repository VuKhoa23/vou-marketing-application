package model

type User struct {
	ID       int64  `gorm:"primary_key" json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
	Phone    string `json:"phone"`
	Gender   string `json:"gender"`
	ImageURL string `json:"image_url"`
}

type UserRequestCoinReq struct {
	TargetId int64 `json:"target_id"`
	EventId  int64 `json:"event_id"`
}

type UserGetAllResponses struct {
	Id       int64  `json:"id"`
	Username string `json:"username"`
}

type TurnRequestRes struct {
	Id        int64 `json:"id"`
	RequestId int64 `json:"request_id"`
	EventId   int64 `json:"event_id"`
	State     bool  `json:"state"`
}

type AcceptTurnReq struct {
	Id int64 `json:"id"`
}
