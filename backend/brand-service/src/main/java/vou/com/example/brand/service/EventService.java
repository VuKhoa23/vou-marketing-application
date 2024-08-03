package vou.com.example.brand.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import vou.com.example.brand.dto.EventDTO;
import vou.com.example.brand.entity.Brand;
import vou.com.example.brand.entity.Event;
import vou.com.example.brand.exception.BrandNotFoundException;
import vou.com.example.brand.repository.BrandRepository;
import vou.com.example.brand.repository.EventRepository;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Date;

@Service
public class EventService {
    private static final String VOLUME_PATH = "F:/Pictures/brand/";
    EventRepository eventRepository;
    BrandRepository brandRepository;

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
                .orElseThrow(() -> new BrandNotFoundException("Brand not found with id: " + brandId));

        String filePath = uploadFile(fileURL);

        Event event = new Event();
        event.setStartDate(eventDTO.getStartDate());
        event.setEndDate(eventDTO.getEndDate());
        event.setVoucherQuantities(event.getVoucherQuantities());
        event.setImageURL(filePath);
        event.setBrand(brand);

        eventRepository.save(event);
    }

    public void updateEvent(){

    }
}
