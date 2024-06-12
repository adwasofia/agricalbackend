const express = require('express');
const axios = require('axios');
const { getUsers, register, login, ubahTanaman } = require('../controller/Users');
const { getAllLokasiLahan, getAllLocationKey, getOneLocationKey } = require('../controller/LokasiLahan');
const { getAllWeatherCondition, getLatestWeatherCondition, insertOneHourlyWeatherCondition, insertTwelveHourlyWeatherCondition, updateWeatherForecast, get12HoursForecasts } = require('../controller/WeatherCondition'); 
const { getAllKegiatan } = require('../controller/Kalender');
const { authenticateJWT } = require('../middleware/tokenVerification');
const { getLatestKondisiLahan, sendInstructionOn, sendInstructionOff } = require('../controller/KondisiLahan');
const { getLatestVolume, getHighestVolume, getHighestPrice } = require('../controller/DataPasar');

const router = express.Router();
const middle = express.urlencoded({ extended: false });

router.get('/', async (req, res) => {
    res.status(200).json({
        message: "Welcome to Agrical!"
    })
});


// Route untuk user (signup, signin, settings, users, delete, lokasilahan)
router.get('/protected', authenticateJWT, (req, res) => {
    res.json({ message: `Welcome, ${req.user.username}` });
});
router.get('/users', getUsers);
router.post('/register', register);
router.post('/login', login);
router.post('/ubahtanaman', ubahTanaman);

// Route untuk Dropdown Lokasi Kecamatan
router.get('/getalllokasilahan', getAllLokasiLahan);
router.post('/getonelocationkey', getOneLocationKey);

// Route untuk Profil
// edit nama
// edit username
// edit email
// change paswsword
// change tanaman
// log out

// Route untuk Kondisi Lahan
router.get('/latestkondisilahan', getLatestKondisiLahan)
router.post('/turn-on-irigasi', sendInstructionOn)
router.post('/turn-off-irigasi', sendInstructionOff)

// Route untuk weathercondition ()
// router.get('/allweathercondition', getAllWeatherCondition);
router.post('/latestweathercondition', getLatestWeatherCondition);
// router.get('/addweathercondition', insertOneHourlyWeatherCondition);
// router.get('/add12weathercondition', insertTwelveHourlyWeatherCondition);

// Route untuk weatherforecast
router.get('/updateforecast', updateWeatherForecast);
router.post('/displayforecasts', get12HoursForecasts);

// Route untuk kalender
router.get('/allkegiatan', getAllKegiatan);

// Route untuk Lokasi Lahan
// router.get('/alllocationkey', getAllLocationKey);

// Routes untuk data pasar
router.get('/plant-volume-latest-month', getLatestVolume);
router.get('/highest-volume-plant-latest-month', getHighestVolume);
router.get('/highest-harga-jual-plant-latest-month', getHighestPrice);

module.exports = { router };