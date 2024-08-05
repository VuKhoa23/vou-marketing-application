package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type Answer struct {
	ID         primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	QuestionId primitive.ObjectID `json:"question_id" bson:"questionId"`
	Content    string             `bson:"content" json:"title"`
	Truthy     bool               `bson:"truthy" json:"truthy"`
}
