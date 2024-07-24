const { Sequelize, Op } = require('sequelize');
const DailyForecast = require('../models/dailyForecastModel');
const { fetchFiveDailyForecasts } = require('../apiaccuweather');

const insertFiveDailyForecasts = async (locationKey, res) => {
    try {
        const fetchedData = await fetchFiveDailyForecasts(locationKey);

        const transformedDatas = fetchedData.map(data => ({
            dateTime: new Date(data.DailyForecasts.Date),
            locationKey: locationKey,
            dayWeatherIcon: data.DailyForecasts.Day.Icon,
            nightWeatherIcon: data.DailyForecasts.Night.Icon,
            dayIconPhrase: data.DailyForecasts.Day.IconPhrase,
            nightIconPhrase: data.DailyForecasts.Night.IconPhrase,
            dayHasPrecipitation: data.DailyForecasts.Day.HasPrecipitation,
            nightHasPrecipitation: data.DailyForecasts.Night.HasPrecipitation,
            minTemperatureValue: data.DailyForecasts.Temperature.Minimum.Value,
            maxTemperatureValue: data.DailyForecasts.Temperature.Maximum.Value,
            temperatureUnit: data.DailyForecasts.Temperature.Minimum.Unit,
            temperatureUnitType: data.DailyForecasts.Temperature.Minimum.UnitType
        }));

        transformedDatas.forEach(async transformedData => {
            const recordExists = await DailyForecast.findOne({ where: { dateTime: transformedData.dateTime } });
            if (recordExists) {
                await recordExists.destroy();
            }
        });

        const newForecasts = await DailyForecast.bulkCreate(transformedDatas);

        res.status(200).json({
            message: "Lime daily forecasts terbaru telah ditambahkan.",
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