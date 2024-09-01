package vou.com.example.brand.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import vou.com.example.brand.dto.request.*;
import vou.com.example.brand.dto.response.GameDTOResponse;
import vou.com.example.brand.entity.Brand;
import vou.com.example.brand.service.BrandService;

import java.util.List;

@RestController
@RequestMapping("api/brand")
public class BrandController {
    private BrandService brandService;

    @Autowired
    public BrandController(BrandService brandService){
        this.brandService = brandService;
    }

    @GetMapping("find-all")
    public List<Brand> findAll(){
        return brandService.findAll();
    }

    @GetMapping("/get-game")
    public String getGame(@RequestParam String gameId) {
        return brandService.getGame(gameId);
    }

    @PostMapping("/create-game")
    public GameDTOResponse createGame(@RequestBody GameDTORequest gameDTORequest) {
        return brandService.createGame(gameDTORequest);
    }

    @PostMapping("/create-question-with-answers")
    public String createQuestionWithAnswers(@RequestBody CreateQuestionWithAnswersDTORequest createQuestionWithAnswersDTORequest) {
        return brandService.createQuestionAndAnswers(createQuestionWithAnswersDTORequest);
    }


//    @PostMapping("/create-question")
//    public QuestionDTOResponse createQuestion(@RequestBody QuestionDTORequest questionDTORequest) {
//        return brandService.createQuestion(questionDTORequest);
//    }

//    @PostMapping("/create-answer")
//    public String createAnswer(@RequestBody QuestionWithAnswerDTORequest questionWithAnswerDTORequest) {
//        return brandService.createAnswer(questionWithAnswerDTORequest);
//    }

    @GetMapping("hello")
    public String sayHello(){
        return "hello world";
    }
}
