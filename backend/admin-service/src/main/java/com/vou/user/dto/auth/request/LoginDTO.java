package com.vou.user.dto.auth.request;

import lombok.Data;

@Data
public class LoginDTO {
    private String username;
    private String password;
}
