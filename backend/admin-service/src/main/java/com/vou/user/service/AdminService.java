package com.vou.user.service;

import com.vou.user.dto.auth.request.RegisterDTO;
import com.vou.user.entity.Admin;
import com.vou.user.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminService {
    private AdminRepository adminRepository;
    private PasswordEncoder passwordEncoder;
    private UserService userService;

    @Autowired
    public AdminService(AdminRepository adminRepository, PasswordEncoder passwordEncoder, UserService userService){
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
    }

    public void createUserAccount(){

    }

    public void createAdminAccount(RegisterDTO registerDTO){
        Admin newAdmin = new Admin();
        newAdmin.setUsername(registerDTO.getUsername());
        newAdmin.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        newAdmin.setName(registerDTO.getName());
        newAdmin.setEmail(registerDTO.getEmail());
        newAdmin.setPhone(registerDTO.getPhone());

        adminRepository.save(newAdmin);
    }

    public void updateAdminAccount(RegisterDTO registerDTO, Integer adminId){
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new UsernameNotFoundException("Admin not found with ID: " + adminId));

        if (!admin.getUsername().equals(userService.getCurrentUserName())){
            if(registerDTO.getUsername() != null){
                admin.setUsername(registerDTO.getUsername());
            }
            if(registerDTO.getPassword() != null){
                admin.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
            }
            if(registerDTO.getName() != null){
                admin.setName(registerDTO.getName());
            }
            if(registerDTO.getEmail() != null){
                admin.setEmail(registerDTO.getEmail());
            }
            if(registerDTO.getPhone() != null){
                admin.setPhone(registerDTO.getPhone());
            }

            adminRepository.save(admin);
        }
        else{
            throw new AccessDeniedException("You are not authorized to update this admin account.");
        }
    }

    public void deleteAdminAccount(Integer adminId){
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new UsernameNotFoundException("Admin not found with ID: " + adminId));

        if (!admin.getUsername().equals(userService.getCurrentUserName())){
            adminRepository.deleteById(adminId);
        }
        else{
            throw new AccessDeniedException("You are not authorized to delete this admin account.");
        }
    }
}
