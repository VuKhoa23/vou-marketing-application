package com.vou.user.dto.auth.request;

import jakarta.persistence.Column;
import lombok.Data;

@Data
public class RegisterDTO {
    private String username;
    private String password;
    public String name;
    public String email;
    public String phone;
}