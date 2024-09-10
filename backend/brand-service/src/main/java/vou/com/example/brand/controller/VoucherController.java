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

    @GetMapping("find-all")
    public List<Voucher> findAll(){
        return voucherService.findAll();
    }

    @PostMapping("add")
    public void addVoucher(@RequestParam Long brandId,
                           @RequestPart(value = "voucherQR") MultipartFile voucherQR,
                           @RequestPart(value = "voucherImage") MultipartFile voucherImage,
                           @ModelAttribute VoucherDTO voucherDTO){
        voucherService.addVoucher(brandId, voucherQR, voucherImage, voucherDTO);
    }

    @PutMapping("update")
    public void updateVoucher(@RequestParam Long eventId, @RequestParam int quantities){
        voucherService.updateVoucherQuantities(eventId, quantities);
    }

    @PutMapping("add-by-id")
    public void addVoucherById(@RequestParam Long voucherId, @RequestParam int quantities){
        voucherService.addVoucherQuantities(voucherId, quantities);
    }

    @PutMapping("subtract-by-id")
    public void subtractVoucherById(@RequestParam Long voucherId, @RequestParam int quantities){
        voucherService.subtractVoucherQuantities(voucherId, quantities);
    }

    @GetMapping("quantities")
    public Integer getTotalVoucherQuantities(@RequestParam Long brandId) {
        return voucherService.getTotalVouchersByBrand(brandId);
    }

    @GetMapping("quantities-by-id")
    public Integer getVoucherQuantitiesById(@RequestParam Long voucherId) {
        return voucherService.getVoucherQuantitiesById(voucherId);
    }
}
