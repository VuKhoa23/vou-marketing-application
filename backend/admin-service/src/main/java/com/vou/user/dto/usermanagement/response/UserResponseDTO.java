package com.vou.user.dto.usermanagement.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
public class UserResponseDTO {
    private Integer id;
    private String username;
    private String phone;
    private String gender;
    @JsonProperty("image_url")
    private String imageUrl;
}
