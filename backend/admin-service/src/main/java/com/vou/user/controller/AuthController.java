package com.vou.user.controller;

import com.vou.user.dto.ResponseDTO;
import com.vou.user.dto.auth.request.LoginDTO;
import com.vou.user.dto.auth.request.RegisterDTO;
import com.vou.user.dto.auth.response.AuthResponseDTO;
import com.vou.user.entity.Admin;
import com.vou.user.repository.AdminRepository;
import com.vou.user.security.JwtGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController()
@RequestMapping("auth")
public class AuthController {
    private JwtGenerator jwtGenerator;
    private AuthenticationManager authenticationManager;
    private AdminRepository adminRepository;
    private PasswordEncoder passwordEncoder;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager,
                          AdminRepository adminRepository,
                          PasswordEncoder passwordEncoder,
                          JwtGenerator jwtGenerator) {
        this.authenticationManager = authenticationManager;
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtGenerator = jwtGenerator;
    }
    @PostMapping("login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginDTO loginDTO) {
        try{
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginDTO.getUsername(), loginDTO.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = jwtGenerator.generateToken(authentication);
            return new ResponseEntity<>(AuthResponseDTO.builder().tokenType("Bearer ").accessToken(token).message("Success").build(), HttpStatus.OK);
        }catch (AuthenticationException e){
            return new ResponseEntity<>(AuthResponseDTO.builder().message("Bad credentials").build(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("register")
    public ResponseEntity<ResponseDTO> register(@RequestBody RegisterDTO registerDTO) {
        if (adminRepository.existsByUsername(registerDTO.getUsername())) {
            return new ResponseEntity<>(ResponseDTO.builder().message("Username is already taken!").build(), HttpStatus.BAD_REQUEST);
        } else {
            Admin admin = new Admin();
            admin.setUsername(registerDTO.getUsername());
            admin.setPassword(passwordEncoder.encode(registerDTO.getPassword()));

            adminRepository.save(admin);
            return new ResponseEntity<>(ResponseDTO.builder().message("User registered successfully!").build(), HttpStatus.OK);
        }
    }
}
