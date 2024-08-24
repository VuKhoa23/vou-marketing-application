package vou.com.example.brand.dto.response;

import lombok.Data;

import java.util.Date;

@Data
public class EventDTOResponse {
    long eventId;
    String eventName;
    String eventImageURL;
    Date eventStartDate;
    Date eventEndDate;
}
