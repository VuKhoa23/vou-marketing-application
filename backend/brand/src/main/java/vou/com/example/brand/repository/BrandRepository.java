package vou.com.example.brand.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vou.com.example.brand.entity.Brand;

public interface BrandRepository extends JpaRepository<Brand, Long> {
}
