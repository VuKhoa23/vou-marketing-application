package model

import "time"

type Game struct {
	ID        string    `json:"id"`
	EventID   int       `json:"event_id"`
	StartTime time.Time `json:"start_time"`
	Type      string    `json:"type"`
}

type Answer struct {
	Content string `json:"content"`
	Truthy  bool   `json:"truthy"`
}

type Question struct {
	ID      string   `json:"id"`
	Title   string   `json:"title"`
	Answers []Answer `json:"answers"`
}
