// const { getAllLokasiLahan } = require('./controller/LokasiLahan');
//const { job } = require('./controller/WeatherCondition'); 
// const { fetchData } = require('./apiaccuweather');
const nodeCron = require('node-cron');

const express = require('express');
const { startdb } = require('./config/database');
const { router } = require('./routes/routes');

const app = express();

app.use(express.json());
app.use(router);

startdb();

app.listen(process.env.PORT, (error) => {
    if (error) {
        console.log("Error!");
        console.log(`Error: ${error}`);
    } else {
        console.log(`Server berjalan di port ${process.env.PORT}`);
    }
});

module.exports = { app };

//startdb();
//getAllLokasiLahan();
//getAllWeatherCondition();
//insertWeatherCondition();
//fetchData();
//getLatestWeatherCondition();