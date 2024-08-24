package vou.com.example.brand.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vou.com.example.brand.entity.Brand;

import java.util.Optional;

public interface BrandRepository extends JpaRepository<Brand, Long> {
    Optional<Brand> findByUsername(String name);
    Boolean existsByUsername(String name);
}
