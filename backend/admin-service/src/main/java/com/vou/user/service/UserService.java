package com.vou.user.service;


import com.vou.user.entity.Admin;
import com.vou.user.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private AdminRepository userRepository;

    public Integer getUserIdByUsername(String username) {
        Admin user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        return user.getId();
    }
}
