package com.vou.user.dto.brandmanagement.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
public class BrandRequestDTO {
    private String username;
    private String password;
    private String category;
    private String address;
    private String lat;
    private String lon;
    private Boolean state;
}
