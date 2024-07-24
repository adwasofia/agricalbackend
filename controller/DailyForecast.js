const { Sequelize, Op } = require('sequelize');
const { DailyForecast } = require('../models/dailyForecastModel');
const { fetchFiveDailyForecasts } = require('../apiaccuweather');

const insertFiveDailyForecasts = async (req, res) => {
    const locationKey = req.params.locationKey;
    try {
        const fetchedData = await fetchFiveDailyForecasts(locationKey);

        console.log('Fetched Data:', fetchedData);

        if (!fetchedData || !fetchedData.DailyForecasts || !Array.isArray(fetchedData.DailyForecasts)) {
            throw new Error('Invalid data format');
        }

        const transformedDatas = fetchedData.DailyForecasts.map(data => ({
            dateTime: new Date(data.Date),
            locationKey: locationKey,
            dayWeatherIcon: data.Day.Icon,
            nightWeatherIcon: data.Night.Icon,
            dayIconPhrase: data.Day.IconPhrase,
            nightIconPhrase: data.Night.IconPhrase,
            dayHasPrecipitation: data.Day.HasPrecipitation,
            nightHasPrecipitation: data.Night.HasPrecipitation,
            minTemperatureValue: data.Temperature.Minimum.Value,
            maxTemperatureValue: data.Temperature.Maximum.Value,
            temperatureUnit: data.Temperature.Minimum.Unit,
            temperatureUnitType: data.Temperature.Minimum.UnitType
        }));

        transformedDatas.forEach(async transformedData => {
            const recordExists = await DailyForecast.findOne({ where: { dateTime: transformedData.dateTime } });
            if (recordExists) {
                await recordExists.destroy();
            }
        });

        const newForecasts = await DailyForecast.bulkCreate(transformedDatas);

        res.status(200).json({
            message: "Lima daily forecasts terbaru telah ditambahkan.",
            details: transformedDatas
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error.",
            details: error.message
        });
    }
};

module.exports = { insertFiveDailyForecasts };