package com.vou.user.dto.auth.request;

import lombok.Data;

@Data
public class RegisterDTO {
    private String username;
    private String password;
}