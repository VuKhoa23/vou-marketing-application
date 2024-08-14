package com.vou.user.dto.brandmanagement.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
public class BrandResponseDTO {
    private Integer id;
    private String username;
    private String category;
    private Boolean state;
}
