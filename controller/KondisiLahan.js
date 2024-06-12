const { KondisiLahan } = require('../models/kondisiLahanModel');

function determineWeatherPhrase(temperature, rainamount) {
    if (rainamount > 0) {
        return 'Hujan';
    } else {
        if (temperature >= 27) {
            return 'Cerah';
        } else {
            return 'Berawan';
        }
    }
}

const getLatestKondisiLahan = async (req, res) => {
    try {
        const kondisilahan = await KondisiLahan.findOne({
            attributes: [
                'date', 
                'time', 
                'voltage', 
                'lux', 
                'solarRadiation',  
                'humidity', 
                'temperature', 
                'pressure', 
                'windSpeed', 
                'windDirection', 
                'windGust', 
                'rainAmount',
                'statusIrigasi',
                'waterLevel',
                'moisture',
                'isEmergency'
            ],
            order: [
                ['date', 'DESC'],
                ['time', 'DESC']
            ]
        });
        const latestkondisilahan = {
            date: kondisilahan.date,
            time: kondisilahan.time,
            voltage: kondisilahan.voltage,
            lux: kondisilahan.lux,
            solarradiation: kondisilahan.solarRadiation,
            humidity: kondisilahan.humidity,
            temperature: (`${kondisilahan.temperature}°C`),
            iconPhrase: determineWeatherPhrase(kondisilahan.temperature, kondisilahan.rainAmount),
            pressure: kondisilahan.pressure,
            windspeed: kondisilahan.windSpeed,
            winddirection: kondisilahan.windDirection,
            windgust: kondisilahan.windGust,
            rainamount: kondisilahan.rainAmount,
            statusirigasi: kondisilahan.statusIrigasi,
            waterlevel: kondisilahan.waterLevel,
            moisture: kondisilahan.moisture,
            isemergency: kondisilahan.isEmergency
        }
        res.json(latestkondisilahan);
    } catch (error) {
        console.log(error);
    }
};


const sendInstruction = async (action) => {
    const apiUrl = 'https://dm2kvdp06j.execute-api.a-southeast-2.amazonaws.com/prod/irrigation';

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action })
        });

        const data = await response.json();
        console.log('Response from API:', data);
    } catch (error) {
        console.error('Error sending instruction:', error);
    }
};

// Call these functions when the respective buttons are pressed
// For turning on irrigation
// sendInstruction('TURN_ON_IRRIGATION');

// For turning on weather monitoring
// sendInstruction('TURN_ON_WEATHER_MONITORING');


module.exports = { getLatestKondisiLahan, sendInstruction };