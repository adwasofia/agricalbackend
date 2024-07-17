const { Sequelize } = require('sequelize');
const { db } = require("../config/database");

const { DataTypes } = Sequelize;

const Kalender = db.define('kalender', {
    idkegiatan: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING
    },
    jeniskegiatan: {
        type: DataTypes.ENUM('Tanam', 'Rawat', 'Panen'),
        allowNull: false
    },
    namakegiatan: {
        type: DataTypes.STRING,
        allowNull: false
    },
    catatan: {
        type: DataTypes.STRING
    },
    tanggal: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
});

module.exports = { Kalender };