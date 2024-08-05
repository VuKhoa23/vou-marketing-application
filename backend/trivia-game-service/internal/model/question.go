package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type Question struct {
	ID     primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	GameID primitive.ObjectID `json:"game_id" bson:"gameId"`
	Title  string             `json:"title" bson:"title"`
}
