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