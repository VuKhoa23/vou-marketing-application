package repository

import (
	"context"
	"game-service/internal/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

var (
	answerColl = dbService.Client.Database("gametest").Collection("answer")
)

func CreateAnswer(answer model.Answer) (model.Answer, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err := answerColl.InsertOne(ctx, answer)
	if err != nil {
		return model.Answer{}, err
	}

	return answer, nil
}

func GetAllAnswersByQuestionId(questionId primitive.ObjectID) ([]model.Answer, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := answerColl.Find(ctx, bson.D{{"questionId", questionId}})

	if err != nil {
		return []model.Answer{}, err
	}

	defer cursor.Close(ctx)
	var answers []model.Answer

	for cursor.Next(ctx) {
		var question model.Answer
		if err := cursor.Decode(&question); err != nil {
			return nil, err
		}
		answers = append(answers, question)
	}

	// Check if the cursor encountered any errors during iteration
	if err := cursor.Err(); err != nil {
		return nil, err
	}
	if len(answers) == 0 {
		return []model.Answer{}, nil
	}
	return answers, nil
}
