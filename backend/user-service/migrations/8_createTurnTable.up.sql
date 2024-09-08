CREATE TABLE turn (
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    turn INT NOT NULL,
    PRIMARY KEY (user_id, event_id)
);
