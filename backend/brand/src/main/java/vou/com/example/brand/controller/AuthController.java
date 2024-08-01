package vou.com.example.brand.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vou.com.example.brand.dto.AuthResponseDTO;
import vou.com.example.brand.dto.LoginDTO;
import vou.com.example.brand.dto.RegisterDTO;
import vou.com.example.brand.service.AuthService;
import vou.com.example.brand.service.BrandService;

@RestController
@RequestMapping("api/brand/auth")
public class AuthController {
    private AuthService authService;
    private BrandService brandService;

    @Autowired
    public AuthController(AuthService authService, BrandService brandService){
        this.authService = authService;
        this.brandService = brandService;
    }

    @PostMapping("register")
    public ResponseEntity<String> register(@RequestBody RegisterDTO registerDTO){
        if(!registerDTO.getPassword().equals(registerDTO.getConfirmation())){
            return new ResponseEntity<>("Password and confirmation must match!", HttpStatus.BAD_REQUEST);
        }
        if(brandService.existsByName(registerDTO.getName())){
            return new ResponseEntity<>("Brand name is already taken", HttpStatus.BAD_REQUEST);
        }
        authService.register(registerDTO);
        return new ResponseEntity<>("Brand registered successfully!", HttpStatus.OK);
    }

    @PostMapping("login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginDTO loginDTO) {
        AuthResponseDTO authResponseDTO = authService.login(loginDTO);
        return new ResponseEntity<>(authResponseDTO, HttpStatus.OK);
    }
}
