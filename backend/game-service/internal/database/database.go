package database

import (
	"context"
	"fmt"
	_ "github.com/joho/godotenv/autoload"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"os"
)

type Service struct {
	Client *mongo.Client
}

var (
	host = os.Getenv("DB_HOST")
	port = os.Getenv("DB_PORT")
	//database = os.Getenv("DB_DATABASE")

	db_username = os.Getenv("DB_USERNAME")
	db_password = os.Getenv("DB_ROOT_PASSWORD")
	credential  = options.Credential{
		Username: db_username,
		Password: db_password,
	}
)

func New() *Service {
	client, err := mongo.Connect(context.Background(), options.Client().ApplyURI(fmt.Sprintf("mongodb://%s:%s", host, port)).SetAuth(credential))

	if err != nil {
		log.Fatal(err)

	}
	return &Service{
		Client: client,
	}
}
