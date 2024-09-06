package vou.com.example.brand.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vou.com.example.brand.entity.Event;

import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Long> {
    Page<Event> findByNameContaining(String name, Pageable pageable);
    List<Event> findAllByBrandId(Long brandId);
    Optional<Event> findById(Long id);
    List<Event> findAllByIdIn(List<Long> ids);
}
