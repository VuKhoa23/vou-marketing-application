package vou.com.example.brand.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

@Data
public class VoucherDTO {
    private String id;
    private MultipartFile imageFileQR;
    private MultipartFile imageFile;
    private int value;
    private String description;
    private Date endDate;
}
