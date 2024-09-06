package redis_client

import (
	"github.com/go-redis/redis/v8"
	"os"
)

func InitRedis() *redis.Client {
	rdb := redis.NewClient(&redis.Options{
		Addr:     os.Getenv("REDIS_URL"),
		Password: "", // no password set
		DB:       0,  // use default DB
		PoolSize: 300,
	})
	return rdb
}
