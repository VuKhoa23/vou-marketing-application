package vou.com.example.brand.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import vou.com.example.brand.entity.Event;
import vou.com.example.brand.entity.Voucher;

import java.util.List;

@Data
@AllArgsConstructor
public class EventAndVoucherResponseDTO {
    private List<Event> events;
    private List<Voucher> vouchers;
}
