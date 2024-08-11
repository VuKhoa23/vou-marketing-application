package vou.com.example.brand.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class GameDTOResponse {
    private String id;
    private Long event_id;

    private String start_time;
}
