package vou.com.example.brand.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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

    @PostMapping("add")
    public void addEvent(EventDTO eventDTO){
        eventService.addEvent(eventDTO);
    }
}
