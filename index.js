const { startdb } = require('./config/database');
const { getAllLokasiLahan } = require('./controller/LokasiLahan'); 

startdb();
getAllLokasiLahan();