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

    public String username;

    public String password;

    @org.springframework.data.annotation.Transient
    public Set<GrantedAuthority> getRoles(){
        return new HashSet<GrantedAuthority>();
    }
}
