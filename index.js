//Brad Ayers
//Midterm Sprint
//November 3, 2024

const { Pool } = require('pg');

// PostgreSQL connection
//I wasn't comfortable sharing my database credentials, so I have added the environment variables in the .env file. Please refer to the Readme doc if you want to run this code.
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
  const createTablesQuery = `
    CREATE TABLE IF NOT EXISTS Movies (
      movie_id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      release_year INTEGER NOT NULL,
      genre VARCHAR(100) NOT NULL,
      director_name VARCHAR(255) NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS Customers (
      customer_id SERIAL PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      phone VARCHAR(20)
    );
    
    CREATE TABLE IF NOT EXISTS Rentals (
      rental_id SERIAL PRIMARY KEY,
      customer_id INTEGER NOT NULL REFERENCES Customers(customer_id),
      movie_id INTEGER NOT NULL REFERENCES Movies(movie_id),
      rental_date DATE NOT NULL,
      return_date DATE NOT NULL
    );
  `;
  await pool.query(createTablesQuery);
  console.log("Tables created successfully or already exist.");
}

/**
 * Inserts a new movie into the Movies table.
 */
async function insertMovie(title, year, genre, director) {
  const insertMovieQuery = `
    INSERT INTO Movies (title, release_year, genre, director_name) 
    VALUES ($1, $2, $3, $4)
  `;
  await pool.query(insertMovieQuery, [title, year, genre, director]);
  console.log(`Movie "${title}" added to the database.`);
}

/**
 * Prints all movies in the database to the console.
 */
async function displayMovies() {
  const getAllMoviesQuery = `
    SELECT movie_id, title, release_year, genre, director_name FROM Movies
  `;
  const res = await pool.query(getAllMoviesQuery);
  console.log("Movies in the database:");
  res.rows.forEach((movie) => {
    console.log(`ID: ${movie.movie_id}, Title: ${movie.title}, Year: ${movie.release_year}, Genre: ${movie.genre}, Director: ${movie.director_name}`);
  });
}

/**
 * Updates a customer's email address.
 */
async function updateCustomerEmail(customerId, newEmail) {
  const updateEmailQuery = `
    UPDATE Customers SET email = $1 WHERE customer_id = $2
  `;
  const res = await pool.query(updateEmailQuery, [newEmail, customerId]);
  if (res.rowCount > 0) {
    console.log(`Customer ID ${customerId}'s email updated to ${newEmail}`);
  } else {
    console.log(`Customer ID ${customerId} not found.`);
  }
}

/**
 * Removes a customer from the database along with their rental history.
 */
async function removeCustomer(customerId) {
  const deleteRentalsQuery = `
    DELETE FROM Rentals WHERE customer_id = $1
  `;
  await pool.query(deleteRentalsQuery, [customerId]);

  const deleteCustomerQuery = `
    DELETE FROM Customers WHERE customer_id = $1
  `;
  const res = await pool.query(deleteCustomerQuery, [customerId]);
  if (res.rowCount > 0) {
    console.log(`Customer ID ${customerId} and their rental history have been removed.`);
  } else {
    console.log(`Customer ID ${customerId} not found.`);
  }
}

/**
 * Prints a help message to the console.
 */
function printHelp() {
  console.log('Usage:');
  console.log('  insert <title> <year> <genre> <director> - Insert a movie');
  console.log('  show - Show all movies');
  console.log('  update <customer_id> <new_email> - Update a customer\'s email');
  console.log('  remove <customer_id> - Remove a customer from the database');
}

/**
 * Runs our CLI app to manage the movie rentals database.
 */
async function runCLI() {
  await createTable();

  const args = process.argv.slice(2);
  switch (args[0]) {
    case 'insert':
      if (args.length !== 5) {
        printHelp();
        return;
      }
      await insertMovie(args[1], parseInt(args[2]), args[3], args[4]);
      break;
    case 'show':
      await displayMovies();
      break;
    case 'update':
      if (args.length !== 3) {
        printHelp();
        return;
      }
      await updateCustomerEmail(parseInt(args[1]), args[2]);
      break;
    case 'remove':
      if (args.length !== 2) {
        printHelp();
        return;
      }
      await removeCustomer(parseInt(args[1]));
      break;
    default:
      printHelp();
      break;
  }

  // Close the pool
  await pool.end();
}

runCLI();