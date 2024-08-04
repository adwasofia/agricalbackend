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

const updateIrrigationStatus = async (req, res) => {
    const newstatus = req.body.statusirigasi;
    if (!newstatus) {
        return res.status(400).json({
            message: "New irrigation status is required!"
        });
    }
    const kondisilahan = await KondisiLahan.findOne({
        order: [
            ['date', 'DESC'],
            ['time', 'DESC']
        ]
    });
    if (!kondisilahan) {
        return res.status(404).json({
            message: "Latest kondisi lahan is not found, cannot update irrigation status."
        });
    }
    try {
        kondisilahan.date = kondisilahan.date,
        kondisilahan.time = kondisilahan.time,
        kondisilahan.voltage = kondisilahan.voltage,
        kondisilahan.lux = kondisilahan.lux,
        kondisilahan.solarRadiation = kondisilahan.solarRadiation,
        kondisilahan.humidity = kondisilahan.humidity,
        kondisilahan.temperature = kondisilahan.temperature,
        kondisilahan.pressure = kondisilahan.pressure,
        kondisilahan.windSpeed = kondisilahan.windSpeed,
        kondisilahan.windDirection = kondisilahan.windDirection,
        kondisilahan.windGust = kondisilahan.windGust,
        kondisilahan.rainAmount = kondisilahan.rainAmount,
        kondisilahan.statusIrigasi = newstatus,
        kondisilahan.waterLevel = kondisilahan.waterLevel,
        kondisilahan.moisture = kondisilahan.moisture,
        kondisilahan.isEmergency = kondisilahan.isEmergency
        await kondisilahan.save();
        return res.status(200).json({
            message: "Status irigasi telah diperbarui.",
            details: kondisilahan
        });
    } catch {
        return res.status(500).json({
            message: "Internal server error",
            details: error.message
        });
    }
}

// Call these functions when the respective buttons are pressed
// For turning on irrigation
// sendInstruction('TURN_ON_IRRIGATION');

// For turning on weather monitoring
// sendInstruction('TURN_ON_WEATHER_MONITORING');


module.exports = { getLatestKondisiLahan, sendInstructionOn, sendInstructionOff, updateIrrigationStatus };