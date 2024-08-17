package com.vou.user.service;

import com.vou.user.dto.auth.request.RegisterDTO;
import com.vou.user.entity.Admin;
import com.vou.user.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminService {
    private AdminRepository adminRepository;
    private PasswordEncoder passwordEncoder;

    @Autowired
    public AdminService(AdminRepository adminRepository, PasswordEncoder passwordEncoder){
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void createUserAccount(){

    }

    public void createAdminAccount(RegisterDTO registerDTO){
        Admin newAdmin = new Admin();
        newAdmin.setUsername(registerDTO.getUsername());
        newAdmin.setPassword(passwordEncoder.encode(registerDTO.getPassword()));

        adminRepository.save(newAdmin);
    }
}
