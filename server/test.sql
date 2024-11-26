DROP TABLE IF EXISTS review CASCADE;
DROP TABLE IF EXISTS otp CASCADE; 
DROP TABLE IF EXISTS users CASCADE;


CREATE TABLE users (
  users_id SERIAL PRIMARY KEY,
  users_email VARCHAR(100) UNIQUE NOT NULL,
  users_password VARCHAR(255) NOT NULL
);

CREATE TABLE review (
    review_id SERIAL PRIMARY KEY,
    review_users_id INTEGER,
    review_users_email TEXT,
    review_movie_id INTEGER,
    review_text TEXT,
    review_rating INTEGER,
    review_created_at TIMESTAMP,
    FOREIGN KEY (review_users_id) REFERENCES "users"(users_id)
);

CREATE TABLE otp(
    otp_id SERIAL PRIMARY KEY,
    otp_users_id INTEGER,
    otp_code VARCHAR(6),
    otp_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    otp_validated BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (otp_users_id) REFERENCES "users"(users_id)
)

