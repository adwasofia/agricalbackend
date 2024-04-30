const Knex = require('knex');
const express = require('express');
const pg = require('pg');
const mysql = require('mysql');
const app = express();

const DB_USER = 'root'; // Assuming these are your default values
const DB_PASS = 'sngshdcb29';
const DB_NAME = 'agricalmysql';
const INSTANCE_CONNECTION_NAME = 'nimble-acrobat-420707:asia-southeast2:agricalsqldatabase'

app.use(express.json());

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`BarkBark Rest API listening on port ${port}`);
});

app.get("/", async (req, res) => {
    res.json({status: "Bark bark! Ready to roll!"});
});

app.get('/:breed', async (req, res) => {
    const query = "SELECT * FROM breeds WHERE name = ?";
    pool.query(query, [ req.params.breed ], (error, results) => {
        if (!results[0]) {
            res.json({status: "Not found!"});
        } else {
            res.json(results[0]);
        }
    });
});

const pool = mysql.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
});


// const { Pool } = pg

// const client = new Client({
//     host: 'my.database-server.com',
//     port: 5334,
//     database: 'database-name',
//     user: 'database-user',
//     password: 'secretpassword!!',
//   })
 
// const pool = new Pool({
//   host: 'localhost',
//   user: 'database-user',
//   max: 20,
//   idleTimeoutMillis: 30000,
//   connectionTimeoutMillis: 2000,
// })

// // Function to create Knex pool
// const createUnixSocketPool = async (config) => {
//   return Knex({
//     client: 'pg',
//     connection: {
//       user: config.user,
//       password: config.password,
//       database: config.database,
//       host: config.host,
//     },
//   });
// };

// // Initialize Knex pool
// createUnixSocketPool({
//   user: DB_USER,
//   password: DB_PASS,
//   database: DB_NAME,
//   host: INSTANCE_UNIX_SOCKET,
// }).then((pool) => {
//   const app = express();

//   app.get('/', async (req, res) => {
//     try {
//       await pool.query('INSERT INTO visits(created_at) VALUES(NOW())');
//       const { rows } = await pool.query('SELECT created_at FROM visits ORDER BY created_at DESC LIMIT 5');
//       console.table(rows); // prints the last 5 visits
//       res.send(rows);
//     } catch (error) {
//       console.error('Error executing query:', error);
//       res.status(500).send('Internal Server Error');
//     }
//   });

//   const port = parseInt(process.env.PORT) || 8080;
//   app.listen(port, async () => {
//     console.log(`Server listening on port ${port}`);
//     try {
//       await pool.raw(`CREATE TABLE IF NOT EXISTS visits (
//         id SERIAL NOT NULL,
//         created_at timestamp NOT NULL,
//         PRIMARY KEY (id)
//       );`);
//       console.log('Table "visits" created successfully.');
//     } catch (error) {
//       console.error('Error creating table:', error);
//     }
//   });
// }).catch((error) => {
//   console.error('Error creating Knex pool:', error);
// });
