package vou.com.example.brand.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import vou.com.example.brand.dto.request.GameDTORequest;
import vou.com.example.brand.dto.request.QuestionDTORequest;
import vou.com.example.brand.dto.request.QuestionWithAnswerDTORequest;
import vou.com.example.brand.dto.response.GameDTOResponse;
import vou.com.example.brand.dto.response.QuestionDTOResponse;
import vou.com.example.brand.entity.Brand;
import vou.com.example.brand.repository.BrandRepository;

import java.util.List;
import java.util.Optional;

@Service
public class BrandService {
    private BrandRepository brandRepository;
    private RestTemplate restTemplate;

    private static final String gameURL = "http://127.0.0.1:40950/api/game";
    private static final String createGameURL = gameURL;
    private static final String createQuestionURL = gameURL + "/create-question";
    private static final String createAnswerURL = gameURL + "/create-answers";

    @Autowired
    public BrandService(BrandRepository brandRepository, RestTemplate restTemplate){
        this.brandRepository = brandRepository;
        this.restTemplate = restTemplate;
    }

    public Optional<Brand> findByName(String name){
        return brandRepository.findByName(name);
    }
    public Boolean existsByName(String name){
        return brandRepository.existsByName(name);
    }

    public Long getBrandIdByName(String name) {
        Brand brand = brandRepository.findByName(name)
                .orElseThrow(() -> new UsernameNotFoundException("Brand not found with name: " + name));
        return brand.getId();
    }

    public List<Brand> findAll(){
        return brandRepository.findAll();
    }

    public String getGame(String gameId) {
        return restTemplate.getForObject(createGameURL + "/" + gameId, String.class);
    }

    public GameDTOResponse createGame(GameDTORequest gameDTORequest) {
        System.out.println("Sending request to game service: " + gameDTORequest);
        return restTemplate.postForObject(createGameURL, gameDTORequest, GameDTOResponse.class);
    }

    public QuestionDTOResponse createQuestion(QuestionDTORequest questionDTORequest) {
        System.out.println("Sending request to game service: " + questionDTORequest);
        return restTemplate.postForObject(createQuestionURL, questionDTORequest, QuestionDTOResponse.class);
    }

    public String createAnswer(QuestionWithAnswerDTORequest questionWithAnswerDTORequest) {
        System.out.println("Sending request to game service: " + questionWithAnswerDTORequest);
        return restTemplate.postForObject(createAnswerURL, questionWithAnswerDTORequest, String.class);
    }
}
