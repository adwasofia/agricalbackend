const { Sequelize } = require('sequelize');
const { db } = require("../config/database");

const { DataTypes } = Sequelize;

const WeatherCondition = db.define('AccuWeatherCondition', {
    dateTime: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        primaryKey: true
    },
    epochDateTime: {
        type: DataTypes.INTEGER
    },
    weatherIcon: {
        type: DataTypes.INTEGER
    },
    iconPhrase: {
        type: DataTypes.STRING
    },
    hasPrecipitation: {
        type: DataTypes.BOOLEAN
    },
    precipitationType: {
        type: DataTypes.STRING
    },
    precipitationIntensity: {
        type: DataTypes.STRING
    },
    isDayLight: {
        type: DataTypes.BOOLEAN
    },
    temperatureValue: {
        type: DataTypes.INTEGER
    },
    temperatureUnit: {
        type: DataTypes.STRING
    },
    temperatureUnitType: {
        type: DataTypes.INTEGER
    },
    precipitationProbability: {
        type: DataTypes.INTEGER
    }
}, {
    freezeTableName: true,
    timestamps: false
});

module.exports = { WeatherCondition };