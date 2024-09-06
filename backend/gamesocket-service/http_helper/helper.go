package http_helper

import (
	"encoding/json"
	"fmt"
	"gamesocket-service/model"
	"io"
	"net/http"
	"os"
)

var (
	GameServiceURL = os.Getenv("GAME_SERVICE_URL")
)

func GetGameById(gameId string) (model.Game, error) {
	resp, err := http.Get(GameServiceURL + "/api/game/" + gameId)
	if err != nil {
		fmt.Println(err.Error())
		return model.Game{}, nil
	}
	defer resp.Body.Close() // Close the response body when done

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(err.Error())
		return model.Game{}, nil
	}

	var response struct {
		Data model.Game `json:"data"`
	}
	if err := json.Unmarshal(body, &response); err != nil {
		fmt.Println(err.Error())
		return model.Game{}, nil
	}

	return response.Data, nil
}

func GetQuestionsByGameId(gameId string) ([]model.Question, error) {
	resp, err := http.Get(GameServiceURL + "/api/game/get-questions/" + gameId)
	if err != nil {
		fmt.Println(err.Error())
		return []model.Question{}, nil
	}
	defer resp.Body.Close() // Close the response body when done

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(err.Error())
		return []model.Question{}, nil
	}

	var response []model.Question

	if err := json.Unmarshal(body, &response); err != nil {
		fmt.Println(err.Error())
		return []model.Question{}, nil
	}

	return response, nil
}
