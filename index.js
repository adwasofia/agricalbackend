const { startdb } = require('./config/database');
const { getAllLokasiLahan } = require('./controller/LokasiLahan');
const { getAllWeatherCondition, insertWeatherCondition } = require('./controller/WeatherCondition'); 

startdb();
//getAllLokasiLahan();
//getAllWeatherCondition();
insertWeatherCondition();