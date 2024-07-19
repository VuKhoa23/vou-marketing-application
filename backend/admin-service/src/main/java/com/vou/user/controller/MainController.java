package com.vou.user.controller;

import com.vou.user.entity.Admin;
import com.vou.user.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
public class MainController {
    @Autowired
    public AdminRepository adminRepository;
    @GetMapping
    public String helloWorld(){
        adminRepository.save(new Admin("Khoa" + LocalDate.now()));
        return "Hello World";
    }

    @GetMapping("get")
    public List<Admin> getWorld(){
        return adminRepository.findAll();
    }
}
