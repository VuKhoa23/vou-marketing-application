package repository

import (
	"context"
	"game-service/internal/database"
	"game-service/internal/model"
	"go.mongodb.org/mongo-driver/bson"
	"time"
)

func CreateGame(game model.Game) (model.Game, error) {
	dbService := database.New()
	_, err := dbService.Client.Database("gametest").Collection("game").InsertOne(context.TODO(), game)
	if err != nil {
		return model.Game{}, err
	}
	return game, nil
}

func GetAllGames() ([]model.Game, error) {
	dbService := database.New()
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := dbService.Client.Database("gametest").Collection("game").Find(ctx, bson.D{})
	if err != nil {
		return []model.Game{}, err
	}

	defer cursor.Close(ctx)
	var games []model.Game

	for cursor.Next(ctx) {
		var game model.Game
		if err := cursor.Decode(&game); err != nil {
			return nil, err
		}
		games = append(games, game)
	}

	// Check if the cursor encountered any errors during iteration
	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return games, nil
}
