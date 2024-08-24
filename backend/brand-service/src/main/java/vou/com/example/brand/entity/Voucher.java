package vou.com.example.brand.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Table(name = "voucher")
@Data
public class Voucher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @Column(name = "image_url")
    private String imageURL;

    @Column(name = "value")
    private int value;

    @Column(name = "description")
    private String description;

    @Column(name = "voucher_quantities")
    private int voucherQuantities;

    @Column(name = "end_date")
    private Date endDate;

    @Column(name = "status")
    private boolean status = false;

    @OneToOne
    @JoinColumn(name = "event_id")
    private Event event;
}
