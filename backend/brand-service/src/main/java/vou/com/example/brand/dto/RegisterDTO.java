package vou.com.example.brand.dto;

import jakarta.persistence.Column;
import lombok.Data;

@Data
public class RegisterDTO {
    private String name;
    private String password;
    private String confirmation;
    private String category;
    private double longitude;
    private double latitude;
    private boolean isShaking;
    private boolean isTrivia;
}
