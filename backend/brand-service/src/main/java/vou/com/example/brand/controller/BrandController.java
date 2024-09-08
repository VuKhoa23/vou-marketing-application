package vou.com.example.brand.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import vou.com.example.brand.dto.request.*;
import vou.com.example.brand.dto.response.GameDTOResponse;
import vou.com.example.brand.entity.Brand;
import vou.com.example.brand.service.BrandService;
import vou.com.example.brand.service.GameService;

import java.util.List;

@RestController
@RequestMapping("api/brand")
public class BrandController {
    private BrandService brandService;

    @Autowired
    public BrandController(BrandService brandService){
        this.brandService = brandService;
    }

    @GetMapping("info")
    public Brand getInfo(){
        return brandService.getInfo();
    }

    @GetMapping("find-all")
    public List<Brand> findAll(){
        return brandService.findAll();
    }

    @GetMapping("find")
    public Brand findById(@RequestParam Long brandId){
        return brandService.findById(brandId);
    }
}
