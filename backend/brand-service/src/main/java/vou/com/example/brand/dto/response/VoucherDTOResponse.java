package vou.com.example.brand.dto.response;

import lombok.Data;

import java.util.Date;

@Data
public class VoucherDTOResponse {
    Long voucherId;
    String voucherImageURL;
    int voucherValue;
    String voucherDescription;
    int voucherQuantities;
    Date voucherEndDate;
    boolean voucherStatus;
}
