const express = require('express');
const axios = require('axios');
const { getAllLokasiLahan, getAllLocationKey } = require('../controller/LokasiLahan');
const { getAllWeatherCondition, getLatestWeatherCondition, insertOneHourlyWeatherCondition, insertTwelveHourlyWeatherCondition, updateWeatherForecast } = require('../controller/WeatherCondition'); 
const { getAllKegiatan } = require('../controller/Kalender');

const router = express.Router();
const middle = express.urlencoded({ extended: false });

router.get('/', async (req, res) => {
    res.status(200).json({
        message: "Welcome to Agrical!"
    })
});


// Route untuk user (signup, signin, settings, users, delete, lokasilahan)


// Route untuk weathercondition ()
router.get('/allweathercondition', getAllWeatherCondition);
router.get('/latestweathercondition', getLatestWeatherCondition);
router.get('/addweathercondition', insertOneHourlyWeatherCondition);
router.get('/add12weathercondition', insertTwelveHourlyWeatherCondition);

// Route untuk weatherforecast
router.get('/updateforecast', updateWeatherForecast);

// Route untuk kalender
router.get('/allkegiatan', getAllKegiatan);


// Route untuk Lokasi Lahan
router.get('/alllocationkey', getAllLocationKey);

module.exports = { router };