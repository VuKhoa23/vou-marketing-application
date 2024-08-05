package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type Question struct {
	ID     primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	GameID primitive.ObjectID `json:"game_id,omitempty" bson:"gameId,omitempty"`
	Title  string             `json:"title,omitempty" bson:"title,omitempty"`
}
