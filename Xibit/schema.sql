DROP TABLE IF EXISTS users;

CREATE TABLE users
(
    user_id VARCHAR(30) PRIMARY KEY,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    total_likes INT
);