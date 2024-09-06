package vou.com.example.brand.dto.response;

import lombok.Data;
import vou.com.example.brand.entity.Brand;

import java.util.Date;

@Data
public class EventDTOResponse {
    long id;
    String name;
    String imageURL;
    Date startDate;
    Date endDate;
    Brand brand;
    boolean isTrivia;
    boolean isShaking;
}
