package vou.com.example.brand.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vou.com.example.brand.dto.EventDTO;
import vou.com.example.brand.entity.Event;
import vou.com.example.brand.entity.Voucher;
import vou.com.example.brand.service.EventService;

import java.util.List;

@RestController
@RequestMapping("api/brand/event")
public class EventController {
    private EventService eventService;

    @Autowired
    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping("hello")
    public void sayHello(){
        System.out.println("Hello my friend");
    }

    @GetMapping("findAll")
    public List<Event> findAll(){
        return eventService.findAll();
    }

    @PostMapping("add")
    public ResponseEntity<String> addEvent(@RequestParam Long brandId,
                                           @RequestPart(value = "fileURL") MultipartFile fileURL,
                                           @ModelAttribute (value = "eventDTO")  EventDTO eventDTO){
        System.out.println("Received brandId: " + brandId);
        System.out.println("Received file: " + fileURL.getOriginalFilename());
        System.out.println("Received eventDTO: " + eventDTO);
        eventService.addEvent(brandId, fileURL, eventDTO);
        return ResponseEntity.ok("Event added successfully!");
    }

    @PostMapping("update")
    public ResponseEntity<String> updateEvent(@RequestParam Long eventId,
                                           @RequestPart(value = "fileURL") MultipartFile fileURL,
                                           @ModelAttribute (value = "eventDTO")  EventDTO eventDTO){
        eventService.updateEvent(eventId, fileURL, eventDTO);
        return ResponseEntity.ok("Event updated successfully!");
    }

    @GetMapping("search/findByNameContaining")
    public Page<Event> findByNameContaining(@RequestParam("name") String name, Pageable pageable){
        return eventService.findByNameContaining(name, pageable);
    }
}
