CREATE TABLE coin (
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    coin INT NOT NULL,
    PRIMARY KEY (user_id, event_id)
);
