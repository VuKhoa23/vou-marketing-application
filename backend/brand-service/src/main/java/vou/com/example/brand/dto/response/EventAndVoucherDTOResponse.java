package vou.com.example.brand.dto.response;

import lombok.Data;
import vou.com.example.brand.dto.EventDTO;
import vou.com.example.brand.dto.VoucherDTO;

import java.util.Date;

@Data
public class EventAndVoucherDTOResponse {
    private EventDTOResponse event;
    private VoucherDTOResponse voucher;
}
