package vou.com.example.brand.dto;

import lombok.Data;

@Data
public class RegisterDTO {
    private String username;
    private String password;
    private String confirmation;
    private String category;
    private double longitude;
    private double latitude;
}
