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
	Id        int    `json:"Id"`
	Name      string `json:"Name"`
	ImageURL  string `json:"ImageURL"`
	StartDate int64  `json:"StartDate"`
	EndDate   int64  `json:"EndDate"`
	Brand     Brand  `json:"brand"`
	Trivia    bool   `json:"trivia"`
	Shaking   bool   `json:"shaking"`
}
