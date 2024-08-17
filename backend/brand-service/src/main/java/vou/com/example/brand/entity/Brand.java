package vou.com.example.brand.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "brand")
@Data
public class Brand {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @Column(name = "name")
    private String name;

    @Column(name = "password")
    private String password;

    @Column(name = "category")
    private String category;

    @Column(name = "address")
    private String address;

    @Column(name = "state")
    private boolean state = false;

    @Column(name = "is_shaking")
    private boolean isShaking = false;

    @Column(name = "is_trivia")
    private boolean isTrivia = false;
}
