package vou.com.example.brand.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vou.com.example.brand.dto.BrandDTO;
import vou.com.example.brand.service.BrandService;

@RestController
@RequestMapping("api/brand")
public class BrandController {
    private BrandService brandService;

    @Autowired
    public BrandController(BrandService brandService){
        this.brandService = brandService;
    }

    @PostMapping("register")
    public ResponseEntity<String> register(@RequestBody BrandDTO brandDTO){
        brandService.register(brandDTO);

        return new ResponseEntity<>("Brand registered successfully!", HttpStatus.OK);
    }
}
