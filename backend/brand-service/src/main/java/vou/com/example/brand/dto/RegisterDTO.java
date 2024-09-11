package vou.com.example.brand.dto;

import jakarta.persistence.Column;
import lombok.Data;

@Data
public class RegisterDTO {
    private String username;
    private String password;
    private String confirmation;
    private String category;
    private String address;
    private String longitude;
    private String latitude;
    private boolean isShaking;
    private boolean isTrivia;
}
