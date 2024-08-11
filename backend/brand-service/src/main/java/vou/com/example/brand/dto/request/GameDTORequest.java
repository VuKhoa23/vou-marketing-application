package vou.com.example.brand.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class GameDTORequest {
    private Long event_id;

    private String start_time;
}
