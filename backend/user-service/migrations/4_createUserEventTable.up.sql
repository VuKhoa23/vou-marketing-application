CREATE TABLE user_event (
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    coin INT NOT NULL,
    turn INT NOT NULL,
    PRIMARY KEY (user_id, event_id)
);
