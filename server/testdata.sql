INSERT INTO review (
    review_id,
    review_users_id,
    review_text,
    review_rating,
    review_created_at
)
VALUES (
    3,
    3,                                      
    'This movie was fantastic!',
    5,                   
    NOW()                
);

INSERT INTO users (users_email, users_password)
VALUES
    ('user1@example.com', 'password123')  -- User 1

INSERT INTO movie (movie_id, movie_image, movie_title, movie_description)
VALUES
    (1, 'https://example.com/inception.jpg', 'Inception', 'A mind-bending thriller where dreams and reality blur.')

SELECT * FROM review;