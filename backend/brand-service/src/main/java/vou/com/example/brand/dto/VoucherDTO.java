package vou.com.example.brand.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

@Data
public class VoucherDTO {
    private long id;
    private int voucherQuantities;
    private int value;
    private String description;
    private Date endDate;
}
