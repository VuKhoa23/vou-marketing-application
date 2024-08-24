package vou.com.example.brand.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import vou.com.example.brand.entity.Brand;
import vou.com.example.brand.repository.BrandRepository;

import java.util.ArrayList;

@Service
public class CustomerUserDetailsService implements UserDetailsService {
    private BrandRepository brandRepository;

    @Autowired
    public CustomerUserDetailsService(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String name) throws UsernameNotFoundException {
        Brand brand = brandRepository.findByUsername(name).orElseThrow(()
                -> new UsernameNotFoundException("Brand name not found"));
        return new User(brand.getUsername(), brand.getPassword(), new ArrayList<>());
    }
}
