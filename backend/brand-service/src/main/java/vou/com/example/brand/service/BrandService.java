package vou.com.example.brand.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import vou.com.example.brand.entity.Brand;
import vou.com.example.brand.repository.BrandRepository;

import java.util.List;
import java.util.Optional;

@Service
public class BrandService {
    private BrandRepository brandRepository;

    @Autowired
    public BrandService(BrandRepository brandRepository){
        this.brandRepository = brandRepository;
    }

    public Optional<Brand> findByName(String name){
        return brandRepository.findByName(name);
    }
    public Boolean existsByName(String name){
        return brandRepository.existsByName(name);
    }

    public Long getBrandIdByName(String name) {
        Brand brand = brandRepository.findByName(name)
                .orElseThrow(() -> new UsernameNotFoundException("Brand not found with name: " + name));
        return brand.getId();
    }

    public List<Brand> findAll(){
        return brandRepository.findAll();
    }
}
