const nodeCron = require('node-cron');

const express = require('express');
const { startdb } = require('./config/database');
const { router } = require('./routes/routes');
const { authenticateJWT } = require('./middleware/tokenVerification');

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

// authentication endpoint
app.get("/auth-endpoint", authenticateJWT, (request, response) => {
    response.json({ message: "You are authorized to access me" });
});

module.exports = { app };

//startdb();
//getAllLokasiLahan();
//getAllWeatherCondition();
//insertWeatherCondition();
//fetchData();
//getLatestWeatherCondition();