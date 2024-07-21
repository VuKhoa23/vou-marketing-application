package vou.com.example.brand.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

@Data
public class EventDTO {
    private MultipartFile imageFile;
    private Integer voucherQuantities;
    private Date startDate;
    private Date endDate;
}
