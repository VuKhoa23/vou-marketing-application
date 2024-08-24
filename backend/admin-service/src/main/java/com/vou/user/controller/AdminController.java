package com.vou.user.controller;

import com.vou.user.dto.auth.request.RegisterDTO;
import com.vou.user.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController()
@RequestMapping("/api/admin")
public class AdminController {
    private AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService){
        this.adminService = adminService;
    }

    @PostMapping("create-admin")
    public ResponseEntity<String> createAdminAccount(@RequestBody RegisterDTO registerDTO){
        try{
            this.adminService.createAdminAccount(registerDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body("Admin account created successfully.");
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("An error occurred while creating the admin account: " + e.getMessage());
        }
    }

    @PutMapping("update-admin")
    public ResponseEntity<String> updateAdminAccount(@RequestBody RegisterDTO registerDTO, @RequestParam Integer adminId){
        try{
            this.adminService.updateAdminAccount(registerDTO, adminId);
            return ResponseEntity.status(HttpStatus.OK).body("Admin account updated successfully.");
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("An error occurred while updating the admin account: " + e.getMessage());
        }
    }

    @DeleteMapping("delete-admin")
    public ResponseEntity<String> deleteAdminAccount(@RequestParam Integer adminId){
        try{
            this.adminService.deleteAdminAccount(adminId);
            return ResponseEntity.status(HttpStatus.OK).body("Admin account deleted successfully.");
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("An error occurred while deleting the admin account: " + e.getMessage());
        }
    }
}
