package vou.com.example.brand.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import vou.com.example.brand.dto.request.*;
import vou.com.example.brand.dto.response.GameDTOResponse;
import vou.com.example.brand.dto.response.QuestionDTOResponse;
import vou.com.example.brand.entity.Brand;
import vou.com.example.brand.exception.NotFoundException;
import vou.com.example.brand.repository.BrandRepository;

import java.util.List;
import java.util.Optional;

@Service
public class BrandService {
    private BrandRepository brandRepository;
    private RestTemplate restTemplate;
    private static final String gameURL = "http://game-service.default:8081/api/game";
    //private static final String gameURL = "http://127.0.0.1:7781/api/game";
    private static final String createGameURL = gameURL;
    private static final String createQuestionURL = gameURL + "/create-question";
    private static final String createAnswerURL = gameURL + "/create-answers";

    @Autowired
    public BrandService(BrandRepository brandRepository, RestTemplate restTemplate){
        this.brandRepository = brandRepository;
        this.restTemplate = restTemplate;
    }

    public Brand getInfo(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Brand brand = brandRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("Brand not found with name: " + username));

        return brand;
    }

    public Optional<Brand> findByName(String name){
        return brandRepository.findByUsername(name);
    }
    public Boolean existsByName(String name){
        return brandRepository.existsByUsername(name);
    }

    public Long getBrandIdByName(String name) {
        Brand brand = brandRepository.findByUsername(name)
                .orElseThrow(() -> new UsernameNotFoundException("Brand not found with name: " + name));
        return brand.getId();
    }

    public List<Brand> findAll(){
        return brandRepository.findAll();
    }
    public Brand findById(Long brandId){
        return brandRepository.findById(brandId)
                .orElseThrow(() -> new NotFoundException("Brand not found with id: " + brandId));
    }

//    public QuestionDTOResponse createQuestion(QuestionDTORequest questionDTORequest) {
//        System.out.println("Sending request to game service: " + questionDTORequest);
//        return restTemplate.postForObject(createQuestionURL, questionDTORequest, QuestionDTOResponse.class);
//    }
}
