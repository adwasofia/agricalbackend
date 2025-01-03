const { KondisiLahan } = require('../models/kondisiLahanModel');
const { setIrrigationStatus } = require("../iotClient");

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
        const newstatus = kondisilahan.statusIrigasi;
        if (newstatus == true) {
            setIrrigationStatus("ON");
        } else if (newstatus == false) {
            setIrrigationStatus("OFF");
        }
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
        return res.json(latestkondisilahan);
    } catch (error) {
        console.log(error);
    }
};


const sendInstruction = async (action) => {
    const apiUrl = 'https://dm2kvdp06j.execute-api.ap-southeast-2.amazonaws.com/agrical-api';

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action })
        });

        const data = await response.json();
        console.log(data);

        //res.json('Response from API:', data);
    } catch (error) {
        console.error('Error sending instruction:', error);
    }
};

const sendInstructionOn = async (req, res) => {
    try {
        sendInstruction('TURN_ON_IRRIGATION');
    } catch (error) {
        console.error('Error sending instruction:', error);
    }
};

const sendInstructionOff = async (req, res) => {
    try {
        sendInstruction('TURN_OFF_IRRIGATION');
    } catch (error) {
        console.error('Error sending instruction:', error);
    }
};

// Call these functions when the respective buttons are pressed
// For turning on irrigation
// sendInstruction('TURN_ON_IRRIGATION');

// For turning on weather monitoring
// sendInstruction('TURN_ON_WEATHER_MONITORING');


module.exports = { getLatestKondisiLahan, sendInstructionOn, sendInstructionOff };