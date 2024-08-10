package server

import (
	"game-service/internal/model"
	"game-service/internal/repository"
	"game-service/internal/response"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"net/http"
)

type QuestionReq struct {
	ID     primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	GameId primitive.ObjectID `json:"game_id" bson:"gameId"`
	Title  string             `json:"title"`
}

func (s *Server) createQuestionHandler(c *gin.Context) {
	var req QuestionReq
	err := c.ShouldBindJSON(&req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "No data was found",
		})
		return
	}
	req.ID = primitive.NilObjectID

	toBeAdded := model.Question{Title: req.Title, GameID: req.GameId, ID: primitive.NilObjectID}
	question, err := repository.CreateQuestion(toBeAdded)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Cannot create question " + err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, question)
}

func (s *Server) getAllQuestionsByGameIdHandler(c *gin.Context) {
	id, _ := primitive.ObjectIDFromHex(c.Param("gameId"))
	var questions []response.QuestionRep
	questions, err := repository.GetQuestionsByGameId(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Cannot get all question",
		})
		return
	}
	c.JSON(http.StatusOK, questions)
}
