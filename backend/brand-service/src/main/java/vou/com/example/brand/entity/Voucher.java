package vou.com.example.brand.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Table(name = "voucher")
@Data
public class Voucher {
    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "image_qr")
    private String imageQR;

    @Column(name = "image_url")
    private String imageURL;

    @Column(name = "value")
    private int value;

    @Column(name = "description")
    private String description;

    @Column(name = "end_date")
    private Date endDate;

    @Column(name = "status")
    private boolean status = false;

    @ManyToOne
    @JoinColumn(name = "brand_id")
    private Brand brand;
}
