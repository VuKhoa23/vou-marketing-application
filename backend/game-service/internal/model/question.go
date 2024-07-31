package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type Question struct {
	ID    primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Title string             `json:"title" bson:"title"`
}

type Answer struct {
	BelongTo primitive.ObjectID `json:"question_id" bson:"question_id"`
	Content  string             `bson:"content" json:"title"`
	Truthy   bool               `bson:"truthy" json:"truthy"`
}
