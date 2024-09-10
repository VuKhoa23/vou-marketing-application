package vou.com.example.brand.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import vou.com.example.brand.dto.EventDTO;
import vou.com.example.brand.dto.VoucherDTO;
import vou.com.example.brand.entity.Brand;
import vou.com.example.brand.entity.Event;
import vou.com.example.brand.entity.Voucher;
import vou.com.example.brand.exception.InvalidArgumentException;
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
public class VoucherService {
    private static final String VOLUME_PATH = "";
    private VoucherRepository voucherRepository;
    private BrandRepository brandRepository;
    private EventRepository eventRepository;

    @Autowired
    public VoucherService(VoucherRepository voucherRepository,
                          EventRepository eventRepository,
                          BrandRepository brandRepository){
        this.voucherRepository = voucherRepository;
        this.brandRepository = brandRepository;
        this.eventRepository = eventRepository;
    }

    private File convertMultipartFileToFile(MultipartFile file) throws IOException {
        File convertFile = new File(file.getOriginalFilename());
        FileOutputStream fos = new FileOutputStream(convertFile);
        fos.write(file.getBytes());
        fos.close();
        return convertFile;
    }

    private String generateFileName(MultipartFile file) {
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

    public List<Voucher> findAll() {
        return voucherRepository.findAll();
    }

    public void addVoucher(Long brandId, MultipartFile voucherQR, MultipartFile voucherImage, VoucherDTO voucherDTO) {
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new NotFoundException("Brand not found with id: " + brandId));

        Voucher voucher = new Voucher();

        String fileURLQR = uploadFile(voucherQR);
        String fileURL = uploadFile(voucherImage);

        voucher.setImageURL(fileURL);
        voucher.setValue(voucherDTO.getValue());
        voucher.setDescription(voucherDTO.getDescription());
        voucher.setEndDate(voucherDTO.getEndDate());

        voucherRepository.save(voucher);
    }
    public void updateVoucherQuantities(Long eventId, int quantities) {
        Voucher voucher = voucherRepository.findByEvent_Id(eventId);

        voucher.setVoucherQuantities(quantities);
        voucherRepository.save(voucher);
    }

    public void addVoucherQuantities(Long voucherId, int quantities) {
        Voucher voucher = voucherRepository.findById(voucherId)
                .orElseThrow(() -> new NotFoundException("Voucher not found with id: " + voucherId));

        int newQuantities = voucher.getVoucherQuantities() + quantities;
        voucher.setVoucherQuantities(newQuantities);
        voucherRepository.save(voucher);
    }

    public void subtractVoucherQuantities(Long voucherId, int quantities) {
        Voucher voucher = voucherRepository.findById(voucherId)
                .orElseThrow(() -> new NotFoundException("Voucher not found with id: " + voucherId));

        int newQuantities = voucher.getVoucherQuantities() - quantities;

        if (newQuantities < 0) {
            throw new InvalidArgumentException("Insufficient voucher quantities. Current quantities: "
                    + voucher.getVoucherQuantities());
        }

        voucher.setVoucherQuantities(newQuantities);
        voucherRepository.save(voucher);
    }

    public Integer getTotalVouchersByBrand(Long brandId){
        List<Event> events = eventRepository.findAllByBrandId(brandId);
        List<Voucher> vouchers = voucherRepository.findByEventIn(events);

        return vouchers.stream()
                .mapToInt(Voucher::getVoucherQuantities)
                .sum();
    }

    public Integer getVoucherQuantitiesById(Long voucherId){
        Voucher voucher = voucherRepository.findById(voucherId)
                .orElseThrow(() -> new NotFoundException("Voucher not found with id: " + voucherId));
        return voucher.getVoucherQuantities();
    }
}

