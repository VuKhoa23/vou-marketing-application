package server

import (
	"game-service/internal/model"
	"game-service/internal/repository"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"net/http"
)

type Answer struct {
	Content string `json:"content"`
	Truthy  bool   `json:"truthy"`
}

type AnswerReq struct {
	QuestionId primitive.ObjectID `json:"question_id"`
	Answers    []Answer           `json:"answers"`
}

func (s *Server) createAnswersHandler(c *gin.Context) {
	var req AnswerReq
	err := c.ShouldBindJSON(&req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "No data was found",
		})
		return
	}
	for _, a := range req.Answers {
		answer := model.Answer{Content: a.Content, Truthy: a.Truthy, QuestionId: req.QuestionId}
		_, err := repository.CreateAnswer(answer)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "Cannot create answers",
			})
			return
		}
	}
	c.JSON(http.StatusOK, gin.H{"message": "Created answers successfully"})
}
