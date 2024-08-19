package vou.com.example.brand.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vou.com.example.brand.dto.VoucherDTO;
import vou.com.example.brand.entity.Voucher;
import vou.com.example.brand.service.VoucherService;

import java.util.List;

@RestController
@RequestMapping("api/brand/voucher")
public class VoucherController {
    private VoucherService voucherService;

    @Autowired
    public VoucherController(VoucherService voucherService){
        this.voucherService = voucherService;
    }

    @GetMapping("findAll")
    public List<Voucher> findAll(){
        return voucherService.findAll();
    }

    @PostMapping("add")
    public void addVoucher(@RequestParam Long brandId,
                           @RequestPart(value = "fileURLQR") MultipartFile fileURLQR,
                           @RequestPart(value = "fileURL") MultipartFile fileURL,
                           @ModelAttribute VoucherDTO voucherDTO){
        voucherService.addVoucher(brandId, fileURLQR, fileURL, voucherDTO);
    }
}
