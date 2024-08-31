package com.vou.user.controller;

import com.vou.user.dto.ResponseDTO;
import com.vou.user.dto.brandmanagement.request.BrandRequestDTO;
import com.vou.user.dto.brandmanagement.response.BrandResponseDTO;
import org.hibernate.jdbc.Expectation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;

@RestController
@RequestMapping("/api/admin/brand-management")
public class BrandManagementController {

    private final String brandUrl = "http://brand-management-service.default:8082/api/brand-management";

    @Autowired
    public RestTemplate restTemplate;

    @PostMapping("create")
    public ResponseEntity<ResponseDTO<?>> createBrand(@RequestBody(required = false) BrandRequestDTO brandRequestDTO) {
        if (brandRequestDTO == null || brandRequestDTO.getUsername().isEmpty() || brandRequestDTO.getPassword().isEmpty() || brandRequestDTO.getCategory().isEmpty() || brandRequestDTO.getState() == null) {
            return new ResponseEntity<>(ResponseDTO.builder().message("Missing informations").build(), HttpStatus.BAD_REQUEST);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);
        HttpEntity<BrandRequestDTO> requestEntity = new HttpEntity<>(brandRequestDTO, headers);

        try {
            ResponseEntity<Void> response = restTemplate.exchange(
                    brandUrl + "/create",
                    HttpMethod.POST,
                    requestEntity,
                    Void.class
            );
            if (response.getStatusCode().is2xxSuccessful()){
                return new ResponseEntity<>(ResponseDTO.builder().message("Create brand succeed").build(), HttpStatus.OK);
            }
            return new ResponseEntity<>(ResponseDTO.builder().message("Create brand failed").build(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (RestClientException e) {
            return new ResponseEntity<>(ResponseDTO.builder().message("Create brand failed: " + e.getMessage()).build(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("enable/{brandId}")
    public ResponseEntity<ResponseDTO<?>> enableBrand(@PathVariable Integer brandId){
        System.out.println(brandId);
        ResponseEntity<Void> response = restTemplate.exchange(
                brandUrl + "/enable/" + brandId,
                HttpMethod.POST,
                null,
                Void.class
        );
        if (response.getStatusCode().is2xxSuccessful()){
            return new ResponseEntity<>(ResponseDTO.builder().message("Enable brand succeed").build(), HttpStatus.OK);
        }
        return new ResponseEntity<>(ResponseDTO.builder().message("Enable brand failed").build(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PostMapping("disable/{brandId}")
    public ResponseEntity<ResponseDTO<?>> disableBrand(@PathVariable Integer brandId){
        System.out.println(brandId);
        ResponseEntity<Void> response = restTemplate.exchange(
                brandUrl + "/disable/" + brandId,
                HttpMethod.POST,
                null,
                Void.class
        );
        if (response.getStatusCode().is2xxSuccessful()){
            return new ResponseEntity<>(ResponseDTO.builder().message("Disable brand succeed").build(), HttpStatus.OK);
        }
        return new ResponseEntity<>(ResponseDTO.builder().message("Disable brand failed").build(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @GetMapping("get-all")
    public ResponseEntity<ResponseDTO<?>> getAllBrands(@RequestBody(required = false) BrandRequestDTO brandRequestDTO) {
        BrandResponseDTO[] responseData = restTemplate.getForObject(brandUrl + "/get-all", BrandResponseDTO[].class);

        return new ResponseEntity<>(ResponseDTO.builder().message("Get all brands").data(responseData).build(), HttpStatus.OK);
    }
}
