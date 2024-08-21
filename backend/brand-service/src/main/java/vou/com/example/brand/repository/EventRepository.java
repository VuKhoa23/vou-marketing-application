package vou.com.example.brand.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vou.com.example.brand.entity.Event;

public interface EventRepository extends JpaRepository<Event, Long> {
    Page<Event> findByNameContaining(String name, Pageable pageable);
}