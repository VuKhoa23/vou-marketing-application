package response

import (
	"game-service/internal/model"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type QuestionRep struct {
	ID      primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	GameID  primitive.ObjectID `json:"-" bson:"gameId,omitempty"`
	Title   string             `json:"title,omitempty" bson:"title,omitempty"`
	Answers []model.Answer     `json:"answers,omitempty"`
}
