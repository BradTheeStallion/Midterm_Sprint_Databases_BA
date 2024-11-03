-- Brad Ayers
-- Midterm Sprint
-- November 3, 2024

CREATE TABLE Movies (
    movie_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    release_year INTEGER NOT NULL,
    genre VARCHAR(100) NOT NULL,
    director_name VARCHAR(255) NOT NULL
);

CREATE TABLE Customers (
    customer_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20)
);

CREATE TABLE Rentals (
    rental_id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    movie_id INTEGER NOT NULL,
    rental_date DATE NOT NULL,
    return_date DATE NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
    FOREIGN KEY (movie_id) REFERENCES Movies(movie_id)
);

INSERT INTO Movies (title, release_year, genre, director_name) VALUES
    ('The Shining', 1980, 'Horror', 'Stanley Kubrick'),
    ('Hereditary', 2018, 'Horror', 'Ari Aster'),
    ('Get Out', 2017, 'Horror', 'Jordan Peele'),
    ('A Nightmare on Elm Street', 1984, 'Horror', 'Wes Craven'),
    ('The Exorcist', 1973, 'Horror', 'William Friedkin');

INSERT INTO Customers (first_name, last_name, email, phone) VALUES
    ('Kyle', 'Hollett', 'kyle.hollett@keyin.com', '1-709-555-0123'),
    ('Brian', 'Janes', 'brian.janes@keyin.com', '1-709-555-0124'),
    ('Adam', 'Stevenson', 'adam.stevenson@keyin.com', '1-709-555-0125'),
    ('Bran', 'Muffin', 'brandon.shea@keyin.com', '1-709-555-0126'),
    ('Angie', 'Smith', 'angela.flynn@keyin.com', '1-709-555-0127');

INSERT INTO Rentals (customer_id, movie_id, rental_date, return_date) VALUES
    (1, 2, '2024-10-25', '2024-10-28'),
    (1, 5, '2024-10-29', '2024-11-01'),
    (2, 1, '2024-10-26', '2024-10-29'),
    (2, 4, '2024-10-30', '2024-11-02'),
    (3, 3, '2024-10-27', '2024-10-30'),
    (3, 5, '2024-10-31', '2024-11-03'),
    (3, 1, '2024-11-01', '2024-11-04'),
    (4, 3, '2024-10-28', '2024-10-31'),
    (5, 4, '2024-10-29', '2024-11-01'),
    (5, 2, '2024-11-02', '2024-11-05');