package vou.com.example.brand.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class QuestionWithAnswerDTORequest {
    private String questionId;
    private List<AnswerDTORequest> answers;
}
