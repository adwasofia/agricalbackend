const pg = require('pg');
const { Connector } = require('@google-cloud/cloud-sql-connector');
const { Pool } = pg;

(async () => {
  const connector = new Connector();
  const clientOpts = await connector.getOptions({
    instanceConnectionName: 'nimble-acrobat-420707:asia-southeast2:agricalsqldatabase',
    ipType: 'PUBLIC',
  });
  const pool = new Pool({
    ...clientOpts,
    user: 'postgres',
    password: '',
    database: 'agrical',
    max: 5,
  });
  const { rows } = await pool.query('SELECT NOW()');
  console.table(rows); // prints returned time value from server

  await pool.end();
  connector.close();
})();
