CREATE TABLE vouchers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT,
    image_url VARCHAR(255),
    value DECIMAL(10, 2),
    description TEXT,
    voucher_quantities INT,
    end_date DATETIME NOT NULL,
    status BOOLEAN,
    FOREIGN KEY (event_id) REFERENCES events(id)
);