package vou.com.example.brand.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import vou.com.example.brand.dto.request.CreateQuestionWithAnswersDTORequest;
import vou.com.example.brand.dto.request.GameDTORequest;
import vou.com.example.brand.dto.request.QuestionWithAnswerDTORequest;
import vou.com.example.brand.dto.response.GameDTOResponse;
import vou.com.example.brand.dto.response.QuestionDTOResponse;
import vou.com.example.brand.repository.BrandRepository;

import java.util.List;

@Service
public class GameService {
    private RestTemplate restTemplate;
    private static final String gameURL = "http://game-service.default:8081/api/game";
    private static final String createQuestionURL = gameURL + "/create-question";
    private static final String createAnswerURL = gameURL + "/create-answers";

    @Autowired
    public GameService(RestTemplate restTemplate){
        this.restTemplate = restTemplate;
    }

    public String getGame(String gameId) {
        return restTemplate.getForObject(gameURL + "/" + gameId, String.class);
    }

    public List<GameDTOResponse> getGameByEvent(Long eventId) {
        ResponseEntity<List<GameDTOResponse>> responseEntity = restTemplate.exchange(
                gameURL + "/by-event/" + eventId,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<GameDTOResponse>>() {}
        );

        return responseEntity.getBody();
    }

    public GameDTOResponse createGame(GameDTORequest gameDTORequest) {
        System.out.println("Sending request to game service: " + gameDTORequest);
        return restTemplate.postForObject(gameURL, gameDTORequest, GameDTOResponse.class);
    }

    public String createQuestionAndAnswers(CreateQuestionWithAnswersDTORequest createQuestionWithAnswersDTORequest) {
        QuestionDTOResponse questionResponse = restTemplate.postForObject(createQuestionURL, createQuestionWithAnswersDTORequest.getQuestionDTORequest(), QuestionDTOResponse.class);

        String questionId = questionResponse.getId();

        QuestionWithAnswerDTORequest questionWithAnswerDTORequest = new QuestionWithAnswerDTORequest();
        questionWithAnswerDTORequest.setQuestion_id(questionId);
        questionWithAnswerDTORequest.setAnswers(createQuestionWithAnswersDTORequest.getAnswers());

        System.out.println("question id " + questionId);

        return restTemplate.postForObject(createAnswerURL, questionWithAnswerDTORequest, String.class);
    }
}
