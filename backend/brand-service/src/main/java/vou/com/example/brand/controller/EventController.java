package vou.com.example.brand.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vou.com.example.brand.dto.EventDTO;
import vou.com.example.brand.service.EventService;

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
}
