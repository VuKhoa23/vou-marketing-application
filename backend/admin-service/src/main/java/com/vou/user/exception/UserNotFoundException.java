package com.vou.user.exception;

public class UserNotFoundException extends Exception {
    public UserNotFoundException(){
        super("User not found!");
    }
}
