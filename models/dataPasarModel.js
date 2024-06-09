const { Sequelize, DataTypes } = require('sequelize');
const { db } = require('../config/database');

const DataPasar = db.define('sales', {
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
    tanaman: {
        type: DataTypes.STRING,
        allowNull: false
    },
    volumePenjualan: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    hargaJual: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = DataPasar;