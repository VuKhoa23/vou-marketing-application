package main

import (
	"context"
	"encoding/json"
	"fmt"
	"gamesocket-service/http_helper"
	"gamesocket-service/redis_client"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	_ "github.com/joho/godotenv/autoload"
	"github.com/olahol/melody"
	"os"
	"time"
)

var (
	redisClient *redis.Client = redis_client.InitRedis()
)

func main() {
	router := gin.Default()
	m := melody.New()

	router.GET("/ws", func(c *gin.Context) {
		err := m.HandleRequest(c.Writer, c.Request)
		if err != nil {
			fmt.Println(err.Error())
			return
		}
	})

	m.HandleMessage(func(s *melody.Session, msg []byte) {
		fmt.Println(string(msg[:]))
	})

	m.HandleConnect(func(s *melody.Session) {
		id := s.Request.URL.Query().Get("gameId")
		if id == "" {
			_ = s.Close()
		}
		game, err := http_helper.GetGameById(id)
		if err != nil {
			fmt.Println(err.Error())
		}
		if game.ID == "" {
			fmt.Println("Game not found")
			_ = s.CloseWithMsg(melody.FormatCloseMessage(400, "Game not found"))
		}

		cmd := redisClient.Get(context.Background(), game.ID)

		if cmd.Err() != nil {
			fmt.Println(cmd.Err().Error())
		} else {
			if cmd.Val() != "" {
				redisClient.Set(context.Background(), game.ID, "exists", time.Hour*100)
			} else {
				fmt.Println(redisClient.Get(context.Background(), game.ID).Val())
			}
		}

		if game.StartTime.UnixMilli() <= time.Now().UnixMilli() {
			_ = s.CloseWithMsg(melody.FormatCloseMessage(400, "Game ended"))
		}

		questions, err := http_helper.GetQuestionsByGameId(id)

		if err != nil {
			fmt.Println(err.Error())
			_ = s.CloseWithMsg(melody.FormatCloseMessage(500, "Cannot get questions"))
		}

		go func() {
			// stop until the start time

			//
			message := struct {
				Message string `json:"message"`
				Code    string `json:"code"`
			}{Message: "Game will start in 5 seconds", Code: "GAME_NEARLY_READY"}

			time.Sleep(5 * time.Second)
			msg, _ := json.Marshal(message)
			_ = s.Write(msg)
			time.Sleep(5 * time.Second)
			i := -1
			for {
				i++
				data, _ := json.Marshal(questions[i])
				err := s.Write(data)
				if err != nil {
					fmt.Println(err.Error())
					return
				}
				// send question every 15s
				time.Sleep(15 * time.Second)
				if i+1 == len(questions) {
					message.Message = "Game ended"
					message.Code = "GAME_ENDED"
					msg, _ = json.Marshal(message)
					s.Write(msg)
					time.Sleep(5 * time.Second)
					_ = s.CloseWithMsg(melody.FormatCloseMessage(200, "Game ended"))
					break
				}
			}
		}()
	})
	fmt.Println("env: " + os.Getenv("PORT"))
	err := router.Run(":" + os.Getenv("PORT"))
	if err != nil {
		fmt.Println(err.Error())
		return
	}
}
