package repository

import (
	"context"
	"game-service/internal/database"
	"game-service/internal/model"
	"go.mongodb.org/mongo-driver/bson"
	"time"
)

var (
	dbService = database.New()
)

func CreateGame(game model.Game) (model.Game, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err := dbService.Client.Database("gametest").Collection("game").InsertOne(ctx, game)
	if err != nil {
		return model.Game{}, err
	}
	
	return game, nil
}

func GetAllGamesByEventId(eventId int) ([]model.Game, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := dbService.Client.Database("gametest").Collection("game").Find(ctx, bson.D{{"eventId", eventId}})
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
	if len(games) == 0 {
		return []model.Game{}, nil
	}
	return games, nil
}
