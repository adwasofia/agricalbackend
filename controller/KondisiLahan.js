const { KondisiLahan } = require('../models/kondisiLahanModel');

const getLatestKondisiLahan = async (req, res) => {
    try {
        const kondisilahan = await Kondisilahan.findOne({
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

module.exports = { getLatestKondisiLahan };