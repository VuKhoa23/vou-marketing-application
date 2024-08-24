package vou.com.example.brand.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vou.com.example.brand.entity.Event;
import vou.com.example.brand.entity.Voucher;

import java.util.List;
import java.util.Optional;

public interface VoucherRepository extends JpaRepository<Voucher, Long> {
    Optional<Voucher> findById(Long id);
    Voucher findByEvent(Event event);
}
