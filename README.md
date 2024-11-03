# Movie Rental System

This repository was generated from https://github.com/menglishca/database-midterm-base

The project uses JavaScript and PostgreSQL to create a simple movie rental database with a functioning CLI. I chose to use inquirer.js (https://www.npmjs.com/package/inquirer) to make the CLI efficient and user friendly.

Here is an example of the .env file to get the program running (you will need to fill in your own values):

PG_USER=postgres
PG_HOST=localhost
PG_DATABASE=postgres
PG_PASSWORD=password
PG_PORT=port

If you have any difficulty with the .env, don't hesitate to reach out to me.

Once you have your .env set up, run the command:

node index.js

And you should be greeted with the following:

<img width="333" alt="Screenshot 2024-11-03 at 4 10 00 PM" src="https://github.com/user-attachments/assets/2add7707-d34a-4615-a357-1664079ee7dc">

A part of the assignment was to outline how each of the tables are in 3NF, so I will do so here.

In order for a table to be 3NF, we first must demonstrate that 1NF (all fields are atomic(no multi-valued fields)) and 2NF (there is only 1 primary key and all other fields depend on it) are true.

# Movies Table:

1NF: All fields are atomic.
2NF: The primary key is movie_id, and all other attributes depend on it.
3NF: There are no non-key attributes that depend on other non-key attributes (e.g., release_year, genre, and director_name do not depend on each other). 

# Customers Table:

1NF: All fields are atomic.
2NF: The primary key is customer_id, and all other attributes depend on it.
3NF: There are no transitive dependencies among the non-key attributes.

# Rentals Table:

1NF: All fields are atomic.
2NF: The primary key is rental_id, and all other attributes depend on it. The customer_id and movie_id attributes are foreign keys and help establish relationships but do not create partial dependencies.
3NF: There are no transitive dependencies among the non-key attributes. The rental_date and return_date depend only on the primary key and not on other non-key attributes.

Thank you for your interest in my project! Don't hesitate to reach out.

Here is a link to the project template's readme: https://github.com/menglishca/database-midterm-base/blob/main/README.md
