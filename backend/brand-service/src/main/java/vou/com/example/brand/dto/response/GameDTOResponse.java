package vou.com.example.brand.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class GameDTOResponse {
    String id;
    Long event_id;
    String start_time;
    String type;
}
