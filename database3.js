const Knex = require('knex');
const express = require('express');

const DB_USER = 'postgres'; // Assuming these are your default values
const DB_PASS = '';
const DB_NAME = 'agrical';
const INSTANCE_UNIX_SOCKET = '/cloudsql/nimble-acrobat-420707:asia-southeast2:agricalsqldatabase'

// Function to create Knex pool
const createUnixSocketPool = async (config) => {
  return Knex({
    client: 'pg',
    connection: {
      user: config.user,
      password: config.password,
      database: config.database,
      host: config.host,
    },
  });
};

// Initialize Knex pool
createUnixSocketPool({
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  host: INSTANCE_UNIX_SOCKET,
}).then((pool) => {
  const app = express();

  app.get('/', async (req, res) => {
    try {
      await pool.query('INSERT INTO visits(created_at) VALUES(NOW())');
      const { rows } = await pool.query('SELECT created_at FROM visits ORDER BY created_at DESC LIMIT 5');
      console.table(rows); // prints the last 5 visits
      res.send(rows);
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  const port = parseInt(process.env.PORT) || 8080;
  app.listen(port, async () => {
    console.log(`Server listening on port ${port}`);
    try {
      await pool.raw(`CREATE TABLE IF NOT EXISTS visits (
        id SERIAL NOT NULL,
        created_at timestamp NOT NULL,
        PRIMARY KEY (id)
      );`);
      console.log('Table "visits" created successfully.');
    } catch (error) {
      console.error('Error creating table:', error);
    }
  });
}).catch((error) => {
  console.error('Error creating Knex pool:', error);
});
