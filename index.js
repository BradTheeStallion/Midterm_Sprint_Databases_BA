//Bradley Ayers
//Midterm Sprint
//November 3, 2024

const { Pool } = require('pg');
require('dotenv').config();
const inquirer = require('inquirer');

// PostgreSQL connection
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

/**
 * Creates the database tables, if they do not already exist.
 */
async function createTable() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    await client.query(`
      DROP TABLE IF EXISTS Rentals CASCADE;
      DROP TABLE IF EXISTS Movies CASCADE;
      DROP TABLE IF EXISTS Customers CASCADE;
    `);

    // Create Movies table
    await client.query(`
      CREATE TABLE Movies (
        movie_id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        release_year INTEGER NOT NULL,
        genre VARCHAR(100) NOT NULL,
        director_name VARCHAR(255) NOT NULL
      )
    `);

    // Insert Movies data
    await client.query(`
      INSERT INTO Movies (title, release_year, genre, director_name) VALUES
      ('The Shining', 1980, 'Horror', 'Stanley Kubrick'),
      ('Hereditary', 2018, 'Horror', 'Ari Aster'),
      ('Get Out', 2017, 'Horror', 'Jordan Peele'),
      ('A Nightmare on Elm Street', 1984, 'Horror', 'Wes Craven'),
      ('The Exorcist', 1973, 'Horror', 'William Friedkin')
    `);

    // Create Customers table
    await client.query(`
      CREATE TABLE Customers (
        customer_id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(20)
      )
    `);

    // Insert Customers data
    await client.query(`
      INSERT INTO Customers (first_name, last_name, email, phone) VALUES
      ('Lyle', 'Follett', 'kyle.hollett@keyin.com', '1-709-555-0123'),
      ('Brian', 'Janes', 'brian.janes@keyin.com', '1-709-555-0124'),
      ('Adam', 'Stevenson', 'adam.stevenson@keyin.com', '1-709-555-0125'),
      ('Bran', 'Muffin', 'brandon.shea@keyin.com', '1-709-555-0126'),
      ('Angie', 'Smith', 'angela.flynn@keyin.com', '1-709-555-0127')
    `);

    // Create Rentals table
    await client.query(`
      CREATE TABLE Rentals (
        rental_id SERIAL PRIMARY KEY,
        customer_id INTEGER NOT NULL REFERENCES Customers(customer_id) ON DELETE CASCADE,
        movie_id INTEGER NOT NULL REFERENCES Movies(movie_id) ON DELETE CASCADE,
        rental_date DATE NOT NULL,
        return_date DATE NOT NULL
      )
    `);

    // Insert Rentals data
    await client.query(`
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
      (5, 2, '2024-11-02', '2024-11-05')
    `);

    await client.query('COMMIT');
    
    console.log("Tables created successfully.");
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error creating tables:", error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Inserts a new movie into the Movies table.
 */
async function insertMovie(title, year, genre, director) {
  const insertMovieQuery = `
    INSERT INTO Movies (title, release_year, genre, director_name) 
    VALUES ($1, $2, $3, $4)
  `;
  try {
    await pool.query(insertMovieQuery, [title, year, genre, director]);
    console.log(`Movie "${title}" added to the database.`);
  } catch (error) {
    console.error("Error inserting movie:", error);
  }
}

/**
 * Prints all movies in the database to the console.
 */
async function displayMovies() {
  try {
    const getAllMoviesQuery = `
      SELECT movie_id, title, release_year, genre, director_name FROM Movies
    `;
    const res = await pool.query(getAllMoviesQuery);
    console.log("Movies in the database:");
    res.rows.forEach((movie) => {
      console.log(`ID: ${movie.movie_id}, Title: ${movie.title}, Year: ${movie.release_year}, Genre: ${movie.genre}, Director: ${movie.director_name}`);
    });
  } catch (error) {
    console.error("Error displaying movies:", error);
  }
}

/**
 * Updates a customer's email address.
 */
async function updateCustomerEmail(customerId, newEmail) {
  try {
    const updateEmailQuery = `
      UPDATE Customers SET email = $1 WHERE customer_id = $2
    `;
    const res = await pool.query(updateEmailQuery, [newEmail, customerId]);
    if (res.rowCount > 0) {
      console.log(`Customer ID ${customerId}'s email updated to ${newEmail}`);
    } else {
      console.log(`Customer ID ${customerId} not found.`);
    }
  } catch (error) {
    console.error("Error updating customer email:", error);
  }
}

/**
 * Removes a customer from the database along with their rental history.
 */
async function removeCustomer(customerId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const deleteCustomerQuery = `
      DELETE FROM Customers WHERE customer_id = $1
    `;
    const res = await client.query(deleteCustomerQuery, [customerId]);
    
    await client.query('COMMIT');
    
    if (res.rowCount > 0) {
      console.log(`Customer ID ${customerId} and their rental history have been removed.`);
    } else {
      console.log(`Customer ID ${customerId} not found.`);
    }
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error removing customer:", error);
  } finally {
    client.release();
  }
}

/**
 * Prompts the user for action.
 */
async function promptUser() {
  try {
    const { action } = await inquirer.prompt({
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: ['Insert a movie', 'Show all movies', 'Update customer email', 'Remove a customer', 'Exit'],
    });

    switch (action) {
      case 'Insert a movie':
        const movieDetails = await inquirer.prompt([
          { type: 'input', name: 'title', message: 'Movie title:' },
          { type: 'input', name: 'year', message: 'Release year:', validate: value => !isNaN(value) },
          { type: 'input', name: 'genre', message: 'Genre:' },
          { type: 'input', name: 'director', message: 'Director name:' },
        ]);
        await insertMovie(movieDetails.title, parseInt(movieDetails.year), movieDetails.genre, movieDetails.director);
        break;
      case 'Show all movies':
        await displayMovies();
        break;
      case 'Update customer email':
        const updateDetails = await inquirer.prompt([
          { type: 'input', name: 'customerId', message: 'Customer ID:' },
          { type: 'input', name: 'newEmail', message: 'New email:' },
        ]);
        await updateCustomerEmail(parseInt(updateDetails.customerId), updateDetails.newEmail);
        break;
      case 'Remove a customer':
        const removeDetails = await inquirer.prompt({
          type: 'input',
          name: 'customerId',
          message: 'Customer ID:',
        });
        await removeCustomer(parseInt(removeDetails.customerId));
        break;
      case 'Exit':
        console.log('Exiting the application...');
        await pool.end();
        process.exit(0);
        return;
    }

    // Prompt again after completing the action
    await promptUser();
  } catch (error) {
    console.error("Error in prompt:", error);
    await pool.end();
    process.exit(1);
  }
}

/**
 * Runs our CLI app to manage the movie rentals database.
 */
async function runCLI() {
  try {
    await createTable();
    await promptUser();
  } catch (error) {
    console.error("Fatal error:", error);
    await pool.end();
    process.exit(1);
  }
}

runCLI();