package dto

type Brand struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
	Category string `json:"category"`
	Address  string `json:"address"`
	State    bool   `json:"state"`
}

type EventDTO struct {
	EventId        int    `json:"eventId"`
	EventName      string `json:"eventName"`
	EventImageURL  string `json:"eventImageURL"`
	EventStartDate int64  `json:"eventStartDate"`
	EventEndDate   int64  `json:"eventEndDate"`
	Brand          Brand  `json:"brand"`
	Trivia         bool   `json:"trivia"`
	Shaking        bool   `json:"shaking"`
}
