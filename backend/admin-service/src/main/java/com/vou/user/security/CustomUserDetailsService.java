package com.vou.user.security;

import com.vou.user.entity.Admin;
import com.vou.user.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private AdminRepository adminRepository;

    @Autowired
    public CustomUserDetailsService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Admin user = adminRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return null;
        }
        return new User(user.getUsername(), user.getPassword(), user.getRoles());
    }
}
