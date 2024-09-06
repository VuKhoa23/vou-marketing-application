package vou.com.example.brand.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class GameDTORequest {
    Long event_id;
    String start_time;
    String type;
}
