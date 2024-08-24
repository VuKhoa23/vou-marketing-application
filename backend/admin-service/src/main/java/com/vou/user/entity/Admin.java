package com.vou.user.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "admin")
@Data
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer id;

    @Column(name = "username")
    public String username;

    @Column(name = "password")
    public String password;

    @Column(name = "name")
    public String name;

    @Column(name = "email")
    public String email;

    @Column(name = "phone")
    public String phone;

    @org.springframework.data.annotation.Transient
    public Set<GrantedAuthority> getRoles(){
        return new HashSet<GrantedAuthority>();
    }
}
