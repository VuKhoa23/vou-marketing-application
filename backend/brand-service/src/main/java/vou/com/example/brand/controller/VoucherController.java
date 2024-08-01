package vou.com.example.brand.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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
    public void addVoucher(VoucherDTO voucherDTO){
        voucherService.addVoucher(voucherDTO);
    }
}
