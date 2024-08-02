package com.vou.user.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MainController {
    @PostMapping("public")
    public String publicRoute(){
        return "Public route";
    }

    @PostMapping("protected")
    public String protectedRoute(){
        return "Protected route";
    }
}