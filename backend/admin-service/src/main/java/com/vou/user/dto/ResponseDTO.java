package com.vou.user.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResponseDTO<T> {
    private String message;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private T data;
}
