package vou.com.example.brand.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vou.com.example.brand.dto.AuthResponseDTO;
import vou.com.example.brand.dto.LoginDTO;
import vou.com.example.brand.dto.RegisterDTO;
import vou.com.example.brand.entity.Brand;
import vou.com.example.brand.repository.BrandRepository;
import vou.com.example.brand.security.JwtGenerator;

import java.util.Optional;

@Service
public class AuthService {
    AuthenticationManager authenticationManager;
    PasswordEncoder passwordEncoder;
    JwtGenerator jwtGenerator;
    private BrandRepository brandRepository;

    @Autowired
    public AuthService(AuthenticationManager authenticationManager, PasswordEncoder passwordEncoder,
                        JwtGenerator jwtGenerator, BrandRepository brandRepository){
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
        this.jwtGenerator = jwtGenerator;
        this.brandRepository = brandRepository;
    }

    public void register(RegisterDTO registerDTO){
        String name = registerDTO.getUsername();
        String password = registerDTO.getPassword();
        String category = registerDTO.getCategory();
        String address = registerDTO.getAddress();

        Brand brand = new Brand();
        brand.setUsername(name);
        brand.setPassword(passwordEncoder.encode(password));
        brand.setCategory(category);
        brand.setAddress(address);

        brandRepository.save(brand);
    }

    public AuthResponseDTO login(LoginDTO loginDTO) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDTO.getUsername(),
                        loginDTO.getPassword()
                ));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtGenerator.generateToken(authentication);

        return new AuthResponseDTO(token, "Success");
    }
}
