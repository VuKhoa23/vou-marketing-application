package repository

import (
	"context"
	"errors"
	"game-service/internal/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
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

func EditGame(game model.Game) (model.Game, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if !HelperCheckIsGameExist(game.ID) {
		return model.Game{}, errors.New("Game Not Found")
	}
	filter := bson.D{{"_id", game.ID}}
	update := bson.D{{"$set", bson.D{{"eventId", game.EventId``}, {"startTime", game.StartTime}}}}
	if game.EventId == 0 {
		update = bson.D{{"$set", bson.D{{"startTime", game.StartTime}}}}
	}
	_, err := dbService.Client.Database("gametest").Collection("game").UpdateOne(ctx, filter, update)
	if err != nil {
		return model.Game{}, err
	}
	return game, nil
}

func HelperCheckIsGameExist(id primitive.ObjectID) bool {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	count, err := dbService.Client.Database("gametest").Collection("game").CountDocuments(ctx, bson.M{"_id": id})
	if err != nil || count == 0 {
		return false
	}
	return true
}
