package vou.com.example.brand.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import vou.com.example.brand.dto.EventDTO;
import vou.com.example.brand.dto.VoucherDTO;
import vou.com.example.brand.dto.response.EventAndVoucherDTOResponse;
import vou.com.example.brand.dto.response.EventDTOResponse;
import vou.com.example.brand.dto.response.VoucherDTOResponse;
import vou.com.example.brand.entity.Brand;
import vou.com.example.brand.entity.Event;
import vou.com.example.brand.entity.Voucher;
import vou.com.example.brand.exception.NotFoundException;
import vou.com.example.brand.repository.BrandRepository;
import vou.com.example.brand.repository.EventRepository;
import vou.com.example.brand.repository.VoucherRepository;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class EventService {
    private static final String VOLUME_PATH = "F:/Pictures/brand/";
    EventRepository eventRepository;
    BrandRepository brandRepository;
    VoucherRepository voucherRepository;

    @Autowired
    public EventService(EventRepository eventRepository, BrandRepository brandRepository, VoucherRepository voucherRepository){
        this.eventRepository = eventRepository;
        this.brandRepository = brandRepository;
        this.voucherRepository = voucherRepository;
    }

    private File convertMultipartFileToFile(MultipartFile file) throws IOException {
        File convertFile = new File(file.getOriginalFilename());
        FileOutputStream fos = new FileOutputStream(convertFile);
        fos.write(file.getBytes());
        fos.close();
        return convertFile;
    }

    private String generateFileName(MultipartFile file){
        return new Date().getTime() + "-" + file.getOriginalFilename().replace(" ", "_");
    }

    private void saveFileToVolume(String fileName, File file) throws IOException {
        File volumeFile = new File(VOLUME_PATH + fileName);
        if (!volumeFile.getParentFile().exists()) {
            volumeFile.getParentFile().mkdirs();
        }
        if (!volumeFile.exists()) {
            volumeFile.createNewFile();
        }
        try (FileOutputStream fos = new FileOutputStream(volumeFile)) {
            fos.write(java.nio.file.Files.readAllBytes(file.toPath()));
        }
    }

    public String uploadFile(MultipartFile multipartFile) {
        String fileURL = "";
        try {
            File file = convertMultipartFileToFile(multipartFile);
            String fileName = generateFileName(multipartFile);
            fileURL = VOLUME_PATH + fileName;
            saveFileToVolume(fileName, file);
            file.delete();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return fileURL;
    }

    public Long addEvent(Long brandId, String eventImage, EventDTO eventDTO){
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new NotFoundException("Brand not found with id: " + brandId));

        System.out.println("eventDTO " + eventDTO);

        Event event = new Event();
        event.setName(eventDTO.getName());
        event.setStartDate(eventDTO.getStartDate());
        event.setEndDate(eventDTO.getEndDate());
        event.setImageURL(eventImage);
        event.setBrand(brand);
        if(eventDTO.isTrivia()){
            event.setTrivia(true);
        }
        if(eventDTO.isShaking()){
            event.setShaking(true);
        }

        eventRepository.save(event);

        return event.getId();
    }

    public void addVoucher(Long eventId, String voucherImage, VoucherDTO voucherDTO){
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new NotFoundException("Event not found with id: " + eventId));

        System.out.println("voucherDTO " + voucherDTO);

        Voucher voucher = new Voucher();

        voucher.setVoucherQuantities(voucherDTO.getVoucherQuantities());
        voucher.setImageURL(voucherImage);
        voucher.setValue(voucherDTO.getValue());
        voucher.setDescription(voucherDTO.getDescription());
        voucher.setEndDate(voucherDTO.getEndDate());
        voucher.setEvent(event);

        voucherRepository.save(voucher);
    }

    public Long addEventAndVoucher(Long brandId, String eventImage, EventDTO eventDTO,
                                   String voucherImage, VoucherDTO voucherDTO){
        Long eventId = addEvent(brandId, eventImage, eventDTO);
        addVoucher(eventId, voucherImage, voucherDTO);

        return eventId;
    }

    public Page<Event> findByNameContaining(String name, Pageable pageable){
        return eventRepository.findByNameContaining(name, pageable);
    }

    public void updateEvent(Long eventId, EventDTO eventDTO){
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new NotFoundException("Event not found with id: " + eventId));;

        event.setName(eventDTO.getName());
        event.setStartDate(eventDTO.getStartDate());
        event.setEndDate(eventDTO.getEndDate());
        event.setTrivia(eventDTO.isTrivia());
        event.setShaking(eventDTO.isShaking());

        eventRepository.save(event);
    }

    public List<EventAndVoucherDTOResponse> findAllByBrandId(Long brandId) {
        List<EventAndVoucherDTOResponse> responseDTOList = new ArrayList<>();
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new NotFoundException("Brand not found with id: " + brandId));

        List<Event> events = eventRepository.findAllByBrandId(brandId);

        for (Event event : events) {
            EventDTOResponse eventDTO = new EventDTOResponse();

            eventDTO.setId(event.getId());
            eventDTO.setName(event.getName());
            eventDTO.setStartDate(event.getStartDate());
            eventDTO.setEndDate(event.getEndDate());
            eventDTO.setTrivia(event.isTrivia());
            eventDTO.setShaking(event.isShaking());

            VoucherDTOResponse voucherDTO = new VoucherDTOResponse();
            Voucher voucher = voucherRepository.findByEvent(event);
            if(voucher != null){
                voucherDTO.setVoucherId(voucher.getId());
                voucherDTO.setVoucherImageURL(voucher.getImageURL());
                voucherDTO.setVoucherValue(voucher.getValue());
                voucherDTO.setVoucherDescription(voucher.getDescription());
                voucherDTO.setVoucherQuantities(voucher.getVoucherQuantities());
                voucherDTO.setVoucherEndDate(voucher.getEndDate());
                voucherDTO.setVoucherStatus(voucher.isStatus());
            }

            EventAndVoucherDTOResponse responseDTO = new EventAndVoucherDTOResponse();
            responseDTO.setEvent(eventDTO);
            responseDTO.setVoucher(voucherDTO);

            responseDTOList.add(responseDTO);
        }

        return responseDTOList;
    }

    public List<EventAndVoucherDTOResponse> findAll() {
        List<EventAndVoucherDTOResponse> responseDTOList = new ArrayList<>();

        List<Event> events = eventRepository.findAll();

        for (Event event : events) {
            EventDTOResponse eventDTO = new EventDTOResponse();

            eventDTO.setId(event.getId());
            eventDTO.setName(event.getName());
            eventDTO.setImageURL(event.getImageURL());
            eventDTO.setStartDate(event.getStartDate());
            eventDTO.setEndDate(event.getEndDate());
            eventDTO.setBrand(event.getBrand());
            eventDTO.setTrivia(event.isTrivia());
            eventDTO.setShaking(event.isShaking());

            VoucherDTOResponse voucherDTO = new VoucherDTOResponse();
            Voucher voucher = voucherRepository.findByEvent(event);
            if(voucher != null){
                voucherDTO.setVoucherId(voucher.getId());
                voucherDTO.setVoucherImageURL(voucher.getImageURL());
                voucherDTO.setVoucherValue(voucher.getValue());
                voucherDTO.setVoucherDescription(voucher.getDescription());
                voucherDTO.setVoucherQuantities(voucher.getVoucherQuantities());
                voucherDTO.setVoucherEndDate(voucher.getEndDate());
                voucherDTO.setVoucherStatus(voucher.isStatus());
            }

            EventAndVoucherDTOResponse responseDTO = new EventAndVoucherDTOResponse();
            responseDTO.setEvent(eventDTO);
            responseDTO.setVoucher(voucherDTO);

            responseDTOList.add(responseDTO);
        }

        return responseDTOList;
    }

    public List<Event> findAllByIdIn(List<Long> ids) {
        return eventRepository.findAllByIdIn(ids);
    }

    public EventAndVoucherDTOResponse findById(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new NotFoundException("Event not found with id: " + eventId));

        EventDTOResponse eventDTO = new EventDTOResponse();

        eventDTO.setId(event.getId());
        eventDTO.setName(event.getName());
        eventDTO.setStartDate(event.getStartDate());
        eventDTO.setEndDate(event.getEndDate());
        eventDTO.setBrand(event.getBrand());
        eventDTO.setTrivia(event.isTrivia());
        eventDTO.setShaking(event.isShaking());

        VoucherDTOResponse voucherDTO = new VoucherDTOResponse();
        Voucher voucher = voucherRepository.findByEvent(event);
        if(voucher != null){
            voucherDTO.setVoucherId(voucher.getId());
            voucherDTO.setVoucherImageURL(voucher.getImageURL());
            voucherDTO.setVoucherValue(voucher.getValue());
            voucherDTO.setVoucherDescription(voucher.getDescription());
            voucherDTO.setVoucherQuantities(voucher.getVoucherQuantities());
            voucherDTO.setVoucherEndDate(voucher.getEndDate());
            voucherDTO.setVoucherStatus(voucher.isStatus());
        }

        EventAndVoucherDTOResponse responseDTO = new EventAndVoucherDTOResponse();
        responseDTO.setEvent(eventDTO);
        responseDTO.setVoucher(voucherDTO);

        return responseDTO;
    }
}
