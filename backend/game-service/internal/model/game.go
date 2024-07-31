package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

type Game struct {
	ID        primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name      string             `bson:"name" json:"name"`
	BrandName string             `bson:"brandName" json:"brand_name"`
	StartTime time.Time          `bson:"startTime" json:"start_time"`
}
