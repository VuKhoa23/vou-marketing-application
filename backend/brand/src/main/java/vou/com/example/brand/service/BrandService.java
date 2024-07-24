package vou.com.example.brand.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import vou.com.example.brand.dto.BrandDTO;
import vou.com.example.brand.entity.Brand;
import vou.com.example.brand.repository.BrandRepository;

import java.util.Optional;

@Service
public class BrandService {
    private BrandRepository brandRepository;

    @Autowired
    public BrandService(BrandRepository brandRepository){
        this.brandRepository = brandRepository;
    }

    public Optional<Brand> findByName(String name){
        return null;
    }
    public Boolean existsByName(String name){
        return null;
    }

    public Long getBrandIdByName(String name) {
        Brand brand = brandRepository.findByName(name)
                .orElseThrow(() -> new UsernameNotFoundException("Brand not found with name: " + name));
        return brand.getId();
    }

    public void register(BrandDTO brandDTO){
        String name = brandDTO.getName();
        String category = brandDTO.getCategory();
        double longitude = brandDTO.getLongitude();
        double latitude = brandDTO.getLatitude();

        Brand brand = new Brand();
        brand.setName(name);
        brand.setCategory(category);
        brand.setLongitude(longitude);
        brand.setLatitude(latitude);

        brandRepository.save(brand);
    }
}
