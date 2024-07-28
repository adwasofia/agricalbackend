const { Sequelize, Op } = require('sequelize');
const { db } = require('../config/database');
const { DailyForecast } = require('../models/dailyForecastModel');
const { fetchFiveDailyForecasts } = require('../apiaccuweather');

const insertFiveDailyForecasts = async (req, res) => {
    const locationKey = req.params.locationKey;
    const transaction = await db.transaction();
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

        // Using upsert to handle insertion and updating of existing records
        for (const transformedData of transformedDatas) {
            await DailyForecast.upsert(transformedData, { transaction });
        }

        await transaction.commit();

        res.status(200).json({
            message: "Lima daily forecasts terbaru telah ditambahkan.",
            details: transformedDatas
        });
    } catch (error) {
        await transaction.rollback();
        console.error('Error inserting daily forecasts:', error);
        res.status(500).json({
            message: "Internal server error.",
            details: error.message
        });
    }
};

module.exports = { insertFiveDailyForecasts };