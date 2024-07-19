package com.vou.user.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "admin")
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer id;
    public String name;


    public Admin(String name) {
        this.name = name;
    }

    public Admin(){}
}
