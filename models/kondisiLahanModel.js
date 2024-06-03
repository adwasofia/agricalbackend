const { Sequelize } = require('sequelize');
const { db } = require("../config/database");

const { DataTypes } = Sequelize;

const KondisiLahan = db.define('kondisilahan', {
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    time: {
        type: DataTypes.TIME
    },
    voltage: {
        type: DataTypes.FLOAT
    },
    lux: {
        type: DataTypes.FLOAT
    },
    solarRadiation: {
        type: DataTypes.FLOAT
    },
    moisture: {
        type: DataTypes.FLOAT
    },
    humidity: {
        type: DataTypes.FLOAT
    },
    temperature: {
        type: DataTypes.FLOAT
    },
    pressure: {
        type: DataTypes.FLOAT
    },
    windSpeed: {
        type: DataTypes.FLOAT
    },
    windDirection: {
        type: DataTypes.FLOAT
    },
    windGust: {
        type: DataTypes.FLOAT
    },
    rainAmount: {
        type: DataTypes.FLOAT
    },

}, {
    freezeTableName: true,
    timestamps: false
});

module.exports = { KondisiLahan };