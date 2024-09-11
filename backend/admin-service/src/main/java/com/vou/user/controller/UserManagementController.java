package com.vou.user.controller;


import com.vou.user.dto.ResponseDTO;
import com.vou.user.dto.usermanagement.request.UserRequestDTO;
import com.vou.user.dto.usermanagement.request.UserUpdateRequestDTO;
import com.vou.user.dto.usermanagement.response.UserResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/admin/user-management")
public class UserManagementController {
    private final String userUrl = "http://user-management-service.default:8086/api/user-management";
    @Autowired
    public RestTemplate restTemplate;

    @PostMapping("create")
    public ResponseEntity<ResponseDTO<?>> createUser(@RequestBody(required = false) UserRequestDTO userRequestDTO) {

        System.out.println(userRequestDTO);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);
        HttpEntity<UserRequestDTO> requestEntity = new HttpEntity<>(userRequestDTO, headers);

        try {
            ResponseEntity<Void> response = restTemplate.exchange(
                    userUrl + "/create",
                    HttpMethod.POST,
                    requestEntity,
                    Void.class
            );
            if (response.getStatusCode().is2xxSuccessful()){
                return new ResponseEntity<>(ResponseDTO.builder().message("Create user succeed").build(), HttpStatus.OK);
            }
            return new ResponseEntity<>(ResponseDTO.builder().message("Create user failed").build(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (RestClientException e) {
            return new ResponseEntity<>(ResponseDTO.builder().message("Create user failed: " + e.getMessage()).build(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("update/{userId}")
    public ResponseEntity<ResponseDTO<?>> createUser(@RequestBody(required = false) UserUpdateRequestDTO userRequestDTO,
                                                     @PathVariable("userId") Integer userId) {

        System.out.println(userRequestDTO);
        System.out.println(userId);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);
        HttpEntity<UserUpdateRequestDTO> requestEntity = new HttpEntity<>(userRequestDTO, headers);


        try {
            ResponseEntity<Void> response = restTemplate.exchange(
                    userUrl + "/update/" + userId,
                    HttpMethod.PUT,
                    requestEntity,
                    Void.class
            );
            if (response.getStatusCode().is2xxSuccessful()){
                return new ResponseEntity<>(ResponseDTO.builder().message("Update user succeed").build(), HttpStatus.OK);
            }
            return new ResponseEntity<>(ResponseDTO.builder().message("Update user failed").build(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (RestClientException e) {
            return new ResponseEntity<>(ResponseDTO.builder().message("Update user failed: " + e.getMessage()).build(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("get-all")
    public ResponseEntity<ResponseDTO<?>> getAllUsers(@RequestBody(required = false) UserRequestDTO brandRequestDTO) {
        UserResponseDTO[] responseData = restTemplate.getForObject(userUrl + "/get-all", UserResponseDTO[].class);

        return new ResponseEntity<>(ResponseDTO.builder().message("Get all brands").data(responseData).build(), HttpStatus.OK);
    }

    @DeleteMapping("delete/{userId}")
    public ResponseEntity<ResponseDTO<?>> deleteUser(@PathVariable("userId") Integer userId) {

        System.out.println(userId);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);

        try {
            ResponseEntity<Void> response = restTemplate.exchange(
                    userUrl + "/delete/" + userId,
                    HttpMethod.DELETE,
                    null,
                    Void.class
            );
            if (response.getStatusCode().is2xxSuccessful()){
                return new ResponseEntity<>(ResponseDTO.builder().message("Delete user succeed").build(), HttpStatus.OK);
            }
            return new ResponseEntity<>(ResponseDTO.builder().message("Delete user failed").build(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (RestClientException e) {
            return new ResponseEntity<>(ResponseDTO.builder().message("Delete user failed: " + e.getMessage()).build(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
