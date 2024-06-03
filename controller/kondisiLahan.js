const { KondisiLahan } = require('../models/kondisiLahanModel');

const getLatestKondisiLahan = async (req, res) => {
    try {
        const kondisilahan = await KondisiLahan.findOne({
            order: [
              ['date', 'DESC'],
              ['time', 'DESC']
            ]
        });
        const latestkondisilahan = {
            date: kondisilahan.date,
            time: kondisilahan.time,
            temperature: (`${kondisilahan.temperature}°C`),
            moisture: kondisilahan.moisture,
            humidity: kondisilahan.humidity,
            windspeed: kondisilahan.windspeed,
            rainamount: kondisilahan.rainAmount
        }
        res.json(latestkondisilahan);
    } catch (error) {
        console.log(error);
    }
};

module.exports = { getLatestKondisiLahan };