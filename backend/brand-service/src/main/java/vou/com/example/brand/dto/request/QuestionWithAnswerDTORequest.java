package vou.com.example.brand.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class QuestionWithAnswerDTORequest {
    String question_id;
    List<AnswerDTORequest> answers;
}
