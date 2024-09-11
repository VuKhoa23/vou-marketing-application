package com.vou.user.dto.usermanagement.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
public class UserUpdateRequestDTO {
    private String username;
    private String phone;
    private String gender;
    @JsonProperty("image_url")
    private String imageUrl;
}
