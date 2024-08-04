package vou.com.example.brand.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import vou.com.example.brand.dto.EventDTO;
import vou.com.example.brand.dto.VoucherDTO;
import vou.com.example.brand.entity.Brand;
import vou.com.example.brand.entity.Event;
import vou.com.example.brand.entity.Voucher;
import vou.com.example.brand.exception.NotFoundException;
import vou.com.example.brand.repository.BrandRepository;
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

    @Autowired
    public VoucherService(VoucherRepository voucherRepository){
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

    public List<Voucher> findAll(){
        return voucherRepository.findAll();
    }

    public void addVoucher(Long brandId, MultipartFile imageFileQR, MultipartFile imageFile, VoucherDTO voucherDTO){
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new NotFoundException("Brand not found with id: " + brandId));

        Voucher voucher = new Voucher();

        String fileURLQR = uploadFile(imageFileQR);
        String fileURL = uploadFile(imageFile);

        voucher.setId(voucher.getId());
        voucher.setImageQR(fileURLQR);
        voucher.setImageURL(fileURL);
        voucher.setValue(voucher.getValue());
        voucher.setDescription(voucher.getDescription());
        voucher.setEndDate(voucher.getEndDate());
        voucher.setBrand(brand);

        voucherRepository.save(voucher);
    }
}
