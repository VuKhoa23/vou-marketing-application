package vou.com.example.brand.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vou.com.example.brand.dto.EventDTO;
import vou.com.example.brand.dto.IdsDTO;
import vou.com.example.brand.dto.VoucherDTO;
import vou.com.example.brand.dto.response.EventAndVoucherDTOResponse;
import vou.com.example.brand.entity.Event;
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
    public void sayHello() {
        System.out.println("Hello my friend");
    }

    @GetMapping("find-all")
    public List<EventAndVoucherDTOResponse> findAll() {
        return eventService.findAll();
    }

    @PostMapping("find-by-ids")
    public List<Event> findAllByIdIn(@RequestBody IdsDTO idsDTO) {
        List<Long> ids = idsDTO.getIds();
        return eventService.findAllByIdIn(ids);
    }

    @GetMapping("find")
    public Event findById(@RequestParam Long id) {
        return eventService.findById(id);
    }

    @PostMapping("add")
    public ResponseEntity<String> addEvent(@RequestParam Long brandId,
            @RequestPart("eventImage") MultipartFile eventImage,
            @RequestPart("eventDTO") EventDTO eventDTO) {
        System.out.println("Received brandId: " + brandId);
        System.out.println("Received file: " + eventImage.getOriginalFilename());
        System.out.println("Received eventDTO: " + eventDTO);
        eventService.addEvent(brandId, eventImage, eventDTO);
        return ResponseEntity.ok("Event added successfully!");
    }

    @PostMapping("add/event-and-voucher")
    public ResponseEntity<String> addEventAndVoucher(@RequestParam Long brandId,
            @RequestPart("eventImage") MultipartFile eventImage,
            @RequestPart("eventDTO") String eventDTOString,
            @RequestPart("voucherImage") MultipartFile voucherImage,
            @RequestPart("voucherDTO") String voucherDTOString) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        EventDTO eventDTO = objectMapper.readValue(eventDTOString, EventDTO.class);
        VoucherDTO voucherDTO = objectMapper.readValue(voucherDTOString, VoucherDTO.class);
        System.out.println("Received brandId: " + brandId);
        System.out.println("Received file: " + eventImage.getOriginalFilename());
        System.out.println("Received eventDTO: " + eventDTO);
        eventService.addEventAndVoucher(brandId, eventImage, eventDTO, voucherImage, voucherDTO);
        return ResponseEntity.ok("{\"message\": \"Add event and voucher successfully!\"}");
    }

    @PutMapping("update")
    public ResponseEntity<String> updateEvent(@RequestParam Long eventId,
                                           @RequestBody EventDTO eventDTO){
        eventService.updateEvent(eventId, eventDTO);
        return ResponseEntity.ok("Event updated successfully!");
    }

    @GetMapping("search/find-by-name-containing")
    public Page<Event> findByNameContaining(@RequestParam("name") String name, Pageable pageable) {
        return eventService.findByNameContaining(name, pageable);
    }

    @GetMapping("/events-and-vouchers")
    public ResponseEntity<List<EventAndVoucherDTOResponse>> getEventsAndVouchersByBrandId(@RequestParam Long brandId) {
        List<EventAndVoucherDTOResponse> result = eventService.findAllByBrandId(brandId);
        return ResponseEntity.ok(result);
    }
}