const { Sequelize } = require('sequelize');
const { db } = require("../config/database");

const { DataTypes } = Sequelize;

const DailyForecast = db.define('dailyforecasts', {
    dateTime: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        primaryKey: true
    },
    locationKey: {
        type: DataTypes.INTEGER
    },
    dayWeatherIcon: {
        type: DataTypes.INTEGER
    },
    nightWeatherIcon: {
        type: DataTypes.INTEGER
    },
    dayIconPhrase: {
        type: DataTypes.STRING
    },
    nightIconPhrase: {
        type: DataTypes.STRING
    },
    dayHasPrecipitation: {
        type: DataTypes.BOOLEAN
    },
    nightHasPrecipitation: {
        type: DataTypes.BOOLEAN
    },
    minTemperatureValue: {
        type: DataTypes.INTEGER
    },
    maxTemperatureValue: {
        type: DataTypes.INTEGER
    },
    temperatureUnit: {
        type: DataTypes.STRING
    },
    temperatureUnitType: {
        type: DataTypes.INTEGER
    }
}, {
    freezeTableName: true,
    timestamps: false
});

module.exports = { DailyForecast };