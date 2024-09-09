package vou.com.example.brand.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vou.com.example.brand.service.S3Service;

@RestController
@RequestMapping("/api")
public class S3Controller {
    private final S3Service s3Service;

    public S3Controller(S3Service s3Service) {
        this.s3Service = s3Service;
    }

    @GetMapping("/generate-url")
    public String generateUploadUrl() {
        return s3Service.generateUploadURL();
    }
}
