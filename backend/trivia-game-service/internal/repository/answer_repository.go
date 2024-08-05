package repository

import (
	"context"
	"game-service/internal/model"
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
