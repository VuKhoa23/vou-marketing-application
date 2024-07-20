package vou.com.example.brand.dto;

import jakarta.persistence.Column;
import lombok.Data;

@Data
public class BrandDTO {
    private String name;
    private String category;
    private double longitude;
    private double latitude;
}
