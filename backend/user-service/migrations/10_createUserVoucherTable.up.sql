CREATE TABLE user_voucher (
    user_id INT NOT NULL,
    voucher_id INT NOT NULL,
    voucher_quantities INT NOT NULL,
    PRIMARY KEY (user_id, voucher_id)
);
