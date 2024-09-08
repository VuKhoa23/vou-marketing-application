package vou.com.example.brand.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import vou.com.example.brand.dto.request.CreateQuestionWithAnswersDTORequest;
import vou.com.example.brand.dto.request.GameDTORequest;
import vou.com.example.brand.dto.response.GameDTOResponse;
import vou.com.example.brand.service.GameService;

import java.util.List;

@RestController
@RequestMapping("api/brand/game")
public class GameController {
    private GameService gameService;

    @Autowired
    public GameController(GameService gameService){
        this.gameService = gameService;
    }

    @GetMapping("/get-game")
    public String getGame(@RequestParam String gameId) {
        return gameService.getGame(gameId);
    }

    @GetMapping("/get-game/by-event/{eventId}")
    public List<GameDTOResponse> getGameByEvent(@PathVariable Long eventId) {
        return gameService.getGameByEvent(eventId);
    }

    @PostMapping("/create-game")
    public GameDTOResponse createGame(@RequestBody GameDTORequest gameDTORequest) {
        return gameService.createGame(gameDTORequest);
    }

    @PostMapping("/create-question-with-answers")
    public String createQuestionWithAnswers(@RequestBody CreateQuestionWithAnswersDTORequest createQuestionWithAnswersDTORequest) {
        return gameService.createQuestionAndAnswers(createQuestionWithAnswersDTORequest);
    }
}
