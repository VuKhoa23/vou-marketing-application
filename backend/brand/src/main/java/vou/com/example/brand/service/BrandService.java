package vou.com.example.brand.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vou.com.example.brand.dto.BrandDTO;
import vou.com.example.brand.entity.Brand;
import vou.com.example.brand.repository.BrandRepository;

@Service
public class BrandService {
    private BrandRepository brandRepository;

    @Autowired
    public BrandService(BrandRepository brandRepository){
        this.brandRepository = brandRepository;
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
