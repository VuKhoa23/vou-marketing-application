package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

type Game struct {
	ID        primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	EventId   int                `bson:"eventId" json:"event_id"`
	StartTime time.Time          `bson:"startTime" json:"start_time"`
}
