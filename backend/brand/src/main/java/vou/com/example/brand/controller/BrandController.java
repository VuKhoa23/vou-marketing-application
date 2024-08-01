package vou.com.example.brand.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vou.com.example.brand.entity.Brand;
import vou.com.example.brand.service.BrandService;

import java.util.List;

@RestController
@RequestMapping("api/brand")
public class BrandController {
    private BrandService brandService;

    @Autowired
    public BrandController(BrandService brandService){
        this.brandService = brandService;
    }

    public List<Brand> findAll(){
        return brandService.findAll();
    }
}
