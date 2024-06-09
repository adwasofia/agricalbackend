const { Sequelize } = require('sequelize');
const { db } = require("../config/database");

const { DataTypes } = Sequelize;

const KondisiLahan = db.define('kondisilahan', {
    date: {
        type: DataTypes.DATEONLY,
        defaultValue: Sequelize.literal('CURRENT_DATE'),
        primaryKey: true
    },
    time: {
        type: DataTypes.TIME,
        defaultValue: Sequelize.literal('CURRENT_TIME'),
        primaryKey: true
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
    statusIrigasi: {
        type: DataTypes.BOOLEAN
    },
    waterLevel: {
        type: DataTypes.FLOAT
    },
    moisture: {
        type: DataTypes.FLOAT
    },
    isEmergency: {
        type: DataTypes.BOOLEAN
    },

}, {
    freezeTableName: true,
    timestamps: false
});

module.exports = { KondisiLahan };