package vou.com.example.brand.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "brand")
@Data
public class Brand {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @Column(name = "username", unique = true)
    private String username;

    @Column(name = "password")
    private String password;

    @Column(name = "category")
    private String category;

    @Column(name = "address")
    private String address;

    @Column(name = "lon")
    private String lon;

    @Column(name = "lat")
    private String lat;
  
    @Column(name = "state")
    private boolean state = false;
}
