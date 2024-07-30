
const { Sequelize, DataTypes } = require('sequelize');
const { db } = require('../config/database');

const IrrigationSchedule = db.define('irrigationschedule', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    waterDebit: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Belum Selesai', 'Selesai'),
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = IrrigationSchedule;
