package vou.com.example.brand.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class CreateQuestionWithAnswersDTORequest {
    private QuestionDTORequest questionDTORequest;
    private List<AnswerDTORequest> answers;
}