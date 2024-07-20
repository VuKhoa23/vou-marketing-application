package vou.com.example.brand.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vou.com.example.brand.entity.Event;

public interface EventRepository extends JpaRepository<Event, Long> {
}
