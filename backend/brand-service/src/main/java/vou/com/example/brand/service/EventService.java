package vou.com.example.brand.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import vou.com.example.brand.dto.EventDTO;
import vou.com.example.brand.dto.VoucherDTO;
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

    public void addEvent(Long brandId, MultipartFile eventImage, EventDTO eventDTO){
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new NotFoundException("Brand not found with id: " + brandId));

        System.out.println("eventDTO " + eventDTO);

        String filePath = uploadFile(eventImage);

        Event event = new Event();
        event.setName(eventDTO.getName());
        event.setStartDate(eventDTO.getStartDate());
        event.setEndDate(eventDTO.getEndDate());
        event.setImageURL(filePath);
        event.setBrand(brand);
        if(eventDTO.isTrivia()){
            event.setTrivia(true);
        }
        if(eventDTO.isShaking()){
            event.setShaking(true);
        }

        eventRepository.save(event);
    }

    public void addVoucher(Long brandId, MultipartFile voucherImage, VoucherDTO voucherDTO){
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new NotFoundException("Brand not found with id: " + brandId));

        System.out.println("voucherDTO " + voucherDTO);

        Voucher voucher = new Voucher();
        String fileURL = uploadFile(voucherImage);

        voucher.setId(voucherDTO.getId());
        voucher.setVoucherQuantities(voucher.getVoucherQuantities());
        voucher.setImageURL(fileURL);
        voucher.setValue(voucherDTO.getValue());
        voucher.setDescription(voucherDTO.getDescription());
        voucher.setEndDate(voucherDTO.getEndDate());
        voucher.setBrand(brand);

        voucherRepository.save(voucher);
    }

    public void addEventAndVoucher(Long brandId, MultipartFile eventImage, EventDTO eventDTO,
                                   MultipartFile voucherImage, VoucherDTO voucherDTO){
        addEvent(brandId, eventImage, eventDTO);
        addVoucher(brandId, voucherImage, voucherDTO);
    }

    public Page<Event> findByNameContaining(String name, Pageable pageable){
        return eventRepository.findByNameContaining(name, pageable);
    }

    public void updateEvent(Long eventId, MultipartFile fileURL, EventDTO eventDTO){
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new NotFoundException("Event not found with id: " + eventId));;

        String filePath = uploadFile(fileURL);

        event.setName(eventDTO.getName());
        event.setStartDate(eventDTO.getStartDate());
        event.setEndDate(eventDTO.getEndDate());
        event.setImageURL(filePath);

        eventRepository.save(event);
    }

    public List<Event> findAll(){
        return eventRepository.findAll();
    }
}
