CREATE TABLE turn_request (
      id INT AUTO_INCREMENT PRIMARY KEY,
      request_id INT NOT NULL,
      response_id INT NOT NULL,
      event_id INT NOT NULL
);