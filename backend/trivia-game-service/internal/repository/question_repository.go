package repository

import (
	"context"
	"game-service/internal/model"
	"game-service/internal/response"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

var (
	questionColl = dbService.Client.Database("gametest").Collection("question")
)

func CreateQuestion(question model.Question) (model.Question, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	res, err := questionColl.InsertOne(ctx, question)
	if err != nil {
		return model.Question{}, err
	}
	question.ID = res.InsertedID.(primitive.ObjectID)
	return question, nil
}

func GetQuestionsByGameId(gameId primitive.ObjectID) ([]response.QuestionRep, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := questionColl.Find(ctx, bson.D{{"gameId", gameId}})

	if err != nil {
		return []response.QuestionRep{}, err
	}

	defer cursor.Close(ctx)
	var questions []response.QuestionRep

	for cursor.Next(ctx) {
		var question response.QuestionRep
		if err := cursor.Decode(&question); err != nil {
			return nil, err
		}
		answers, _ := GetAllAnswersByQuestionId(question.ID)
		question.Answers = answers
		questions = append(questions, question)
	}

	// Check if the cursor encountered any errors during iteration
	if err := cursor.Err(); err != nil {
		return nil, err
	}
	if len(questions) == 0 {
		return []response.QuestionRep{}, nil
	}
	return questions, nil
}
