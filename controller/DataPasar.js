// const express = require('express');
// const router = express.Router();
const { Sequelize, Op } = require('sequelize');
const DataPasar = require('../models/dataPasarModel');

// Endpoint 1: Get Latest Data for Each Plant with Volume Penjualan in the Latest Month
const getLatestVolume = async (req, res) => {
    try {
        const latestMonth = new Date();
        const latestMonthData = await DataPasar.findAll({
            attributes: [
                'tanaman',
                [Sequelize.fn('MAX', Sequelize.col('date')), 'latestSaleDate'],
                'volumePenjualan'
            ],
            group: ['tanaman']
        });

        const formattedData = latestMonthData.map(data => ({
            tanaman: data.tanaman,
            date: data.get('latestSaleDate'),
            volumePenjualan: data.volumePenjualan
        }));

        const showedData = {tanaman: formattedData}

        res.json(showedData);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Endpoint 2: Get One Plant Name with the Highest Volume Penjualan in the Latest Month
const getHighestVolume = async (req, res) => {
    try {
        const highestVolumePlant = await DataPasar.findOne({
            attributes: ['tanaman', 'volumePenjualan'],
            where: {
                date: {
                    [Op.and]: [
                        Sequelize.where(
                            Sequelize.fn('MONTH', Sequelize.col('date')),
                            Sequelize.fn('MONTH', Sequelize.fn('CURDATE'))
                        ),
                        Sequelize.where(
                            Sequelize.fn('YEAR', Sequelize.col('date')),
                            Sequelize.fn('YEAR', Sequelize.fn('CURDATE'))
                        )
                    ]
                }
            },
            order: [['volumePenjualan', 'DESC']],
            limit: 1
        });
        res.json(highestVolumePlant);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Endpoint 3: Get One Plant Name with the Highest Harga Jual in the Latest Month
const getHighestPrice = async (req, res) => {
    try {
        const highestHargaJualPlant = await DataPasar.findOne({
            attributes: ['tanaman', 'hargaJual'],
            where: {
                date: {
                    [Op.and]: [
                        Sequelize.where(
                            Sequelize.fn('MONTH', Sequelize.col('date')),
                            Sequelize.fn('MONTH', Sequelize.fn('CURDATE'))
                        ),
                        Sequelize.where(
                            Sequelize.fn('YEAR', Sequelize.col('date')),
                            Sequelize.fn('YEAR', Sequelize.fn('CURDATE'))
                        )
                    ]
                }
            },
            order: [['hargaJual', 'DESC']],
            limit: 1
        });
        res.json(highestHargaJualPlant);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getLatestVolume, getHighestVolume, getHighestPrice };
