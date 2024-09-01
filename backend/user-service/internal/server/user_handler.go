package server

type BrandReq struct {
	Username string  `json:"username"`
	Password string  `json:"password"`
	Category *string `json:"category"`
	State    bool    `json:"state"`
}
