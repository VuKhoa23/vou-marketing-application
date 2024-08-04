package repository

import (
	"context"
	"game-service/internal/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

func CreateQuestion(question model.Question) (model.Question, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err := dbService.Client.Database("gametest").Collection("question").InsertOne(ctx, question)
	if err != nil {
		return model.Question{}, err
	}
	return question, nil
}

func GetQuestionsByGameId(gameId primitive.ObjectID) ([]model.Question, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := dbService.Client.Database("gametest").Collection("question").Find(ctx, bson.D{{"gameId", gameId}})

	if err != nil {
		return []model.Question{}, err
	}

	defer cursor.Close(ctx)
	var questions []model.Question

	for cursor.Next(ctx) {
		var question model.Question
		if err := cursor.Decode(&question); err != nil {
			return nil, err
		}
		questions = append(questions, question)
	}

	// Check if the cursor encountered any errors during iteration
	if err := cursor.Err(); err != nil {
		return nil, err
	}
	if len(questions) == 0 {
		return []model.Question{}, nil
	}
	return questions, nil
}
