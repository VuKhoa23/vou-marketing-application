package vou.com.example.brand.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vou.com.example.brand.entity.Voucher;

import java.util.Optional;

public interface VoucherRepository extends JpaRepository<Voucher, String> {
    Optional<Voucher> findById(String id);
}
