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
    public EventService(EventRepository eventRepository, BrandRepository brandRepository){
        this.eventRepository = eventRepository;
        this.brandRepository = brandRepository;
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

    public void addEvent(Long brandId, MultipartFile fileURL, EventDTO eventDTO){
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new NotFoundException("Brand not found with id: " + brandId));

        String filePath = uploadFile(fileURL);

        Event event = new Event();
        event.setName(eventDTO.getName());
        event.setStartDate(eventDTO.getStartDate());
        event.setEndDate(eventDTO.getEndDate());
        event.setVoucherQuantities(event.getVoucherQuantities());
        event.setImageURL(filePath);
        event.setBrand(brand);

        eventRepository.save(event);
    }

    public void addVoucher(Long brandId, MultipartFile imageFileQR, MultipartFile imageFile, VoucherDTO voucherDTO){
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new NotFoundException("Brand not found with id: " + brandId));

        Voucher voucher = new Voucher();

        String fileURLQR = uploadFile(imageFileQR);
        String fileURL = uploadFile(imageFile);

        voucher.setId(voucherDTO.getId());
        voucher.setImageQR(fileURLQR);
        voucher.setImageURL(fileURL);
        voucher.setValue(voucherDTO.getValue());
        voucher.setDescription(voucherDTO.getDescription());
        voucher.setEndDate(voucherDTO.getEndDate());
        voucher.setBrand(brand);

        voucherRepository.save(voucher);
    }

    public void addEventAndVoucher(Long brandId, MultipartFile eventImage, EventDTO eventDTO,
                                   MultipartFile voucherQR, MultipartFile voucherImage, VoucherDTO voucherDTO){
        addEvent(brandId, eventImage, eventDTO);
        addVoucher(brandId, voucherQR, voucherImage, voucherDTO);
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
        event.setVoucherQuantities(event.getVoucherQuantities());
        event.setImageURL(filePath);

        eventRepository.save(event);
    }

    public List<Event> findAll(){
        return eventRepository.findAll();
    }
}