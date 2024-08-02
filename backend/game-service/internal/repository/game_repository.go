package repository

import (
	"context"
	"game-service/internal/database"
	"game-service/internal/model"
)

func CreateGame(game model.Game) (model.Game, error) {
	dbService := database.New()
	_, err := dbService.Client.Database("gametest").Collection("game").InsertOne(context.TODO(), game)
	if err != nil {
		return model.Game{}, err
	}
	return game, nil
}
