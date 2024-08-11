// const express = require('express');
// const router = express.Router();
const { Sequelize, Op } = require('sequelize');
const DataPasar = require('../models/dataPasarModel');

// Rata-rata Volume Produksi
function avgVolumeProduksi(tanaman) {
    try {
        DataPasar.findAll({
            attributes: [[Sequelize.fn('AVG', Sequelize.col('volumeProduksi')), 'avgproduksi']],
            where: {
                tanaman: tanaman
            }
          })
            .then(result => {
              const averageProd = result[0].get('avgproduksi');
              console.log(averageProd);
              return (averageProd);
            })
            .catch(error => {
              console.error('Error fetching average prodution volume:', error);
            });
    } catch (error) {
        console.error(error);
    }
};



// Rata-rata Harga Jual
function avgHargaJual(tanaman) {
    try {
        DataPasar.findAll({
            attributes: [[Sequelize.fn('AVG', Sequelize.col('hargaJual')), 'avghargajual']],
            where: {
                tanaman: tanaman
            }
          })
            .then(result => {
              const averageHarga = result[0].get('avghargajual');
              console.log(averageHarga);
              return (averageHarga);
            })
            .catch(error => {
              console.error('Error fetching average selling price:', error);
            });
    } catch (error) {
        console.error(error);
    }
};

const dataProduksi2024 = async (req, res) => {
    const data = await DataPasar.findAll({
      attributes: ['date', 'volumeProduksi'],
      where: {
        tanaman: 'Bawang Merah',
        date: {
          [Op.between]: [new Date(2024, 0, 1), new Date(2024, 12, 0)]
        }
      }
    });
    const datas = JSON.parse(data);
    return res.status(200).json(datas);
  }

// Endpoint 1: Get Latest Data for Each Plant with Volume Penjualan in the Latest Month
const getLatestVolume = async (req, res) => {
    try {
        const latestMonth = new Date();
        const latestMonthData = await DataPasar.findAll({
            attributes: [
                'date',
                'tanaman',
                'volumeProduksi'
            ],
            where: {
                date: {
                    [Op.and]: [
                        Sequelize.where(
                            Sequelize.fn('MONTH', Sequelize.col('date')),
                            Sequelize.fn('MONTH', Sequelize.fn('CURDATE'))
                        )
                    ]
                }
            },
            group: ['tanaman']
        });

        const formattedData = latestMonthData.map(data => ({
            tanaman: data.tanaman,
            date: data.date,
            volumePenjualan: Math.round(data.volumeProduksi)
        }));

        const showedData = {tanaman: formattedData}

        return res.json(showedData);
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Endpoint 2: Get One Plant Name with the Highest Volume Penjualan in the Latest Month
const getHighestVolume = async (req, res) => {
    try {
        const highestVolumePlant = await DataPasar.findOne({
            attributes: ['tanaman', 'volumeProduksi'],
            where: {
                date: {
                    [Op.and]: [
                        Sequelize.where(
                            Sequelize.fn('MONTH', Sequelize.col('date')),
                            Sequelize.fn('MONTH', Sequelize.fn('CURDATE'))
                        )
                    ]
                }
            },
            order: [['volumeProduksi', 'DESC']],
            limit: 1
        });
        const formattedData = {
            tanaman: highestVolumePlant.tanaman,
            volumePenjualan: Math.round(highestVolumePlant.volumeProduksi)
        };
        return res.json(formattedData);
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ message: 'Internal server error' });
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
                        )
                    ]
                }
            },
            order: [['hargaJual', 'DESC']],
            limit: 1
        });
        const formattedData = {
            tanaman: highestHargaJualPlant.tanaman,
            hargaJual: Math.round(highestHargaJualPlant.hargaJual)
        };
        return res.json(formattedData);
        res.json(highestHargaJualPlant);
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


async function isRecommendedToPlant(inputdate) {
  const plants = ['Bawang Merah', 'Cabai Besar', 'Cabai Keriting', 'Cabai Rawit'];
  const recommendations = {};
  
  const inputDate = new Date(inputdate);
  const futureDate = new Date(inputDate);
  futureDate.setDate(futureDate.getDate() + 90);
  const futureYear = futureDate.getFullYear();
  const futureMonth = futureDate.getMonth() + 1;

  try {
    for (const plant of plants) {
        // Get the average production volume
      const averageVolumeValue = avgVolumeProduksi(plant);
      const averagePriceValue = avgHargaJual(plant);

      // Get the production volume for the future date
      const futureValue = await DataPasar.findOne({
        attributes: ['volumeProduksi', 'hargaJual'],
        where: {
            tanaman: plant,
            date: {
                [Op.and]: [
                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('date')), futureYear),
                    Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('date')), futureMonth)
                ]
            }
        }
      });

      const futureVolumeValue = futureValue ? futureValue.get('volumeProduksi') : null;
      const futurePriceValue = futureValue ? futureValue.get('hargaJual') : null;

      // Determine recommendation
      if (futureVolumeValue !== null && averageVolumeValue !== null && futurePriceValue !== null && averagePriceValue !== null) {
        recommendations[plant] = (futureVolumeValue < averageVolumeValue) && (futurePriceValue > averagePriceValue);
      } else {
        recommendations[plant] = false;
      }
    }

    return recommendations;
  } catch (error) {
    console.error('Error determining recommendations:', error);
    return null;
  }
};


const getRecommendation = async (req, res) => {
    try {
        const recommendation = isRecommendedToPlant('2024-06-24');
        res.json(recommendation);
    } catch(error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = { getLatestVolume, getHighestVolume, getHighestPrice, avgVolumeProduksi, avgHargaJual, isRecommendedToPlant, getRecommendation, dataProduksi2024 };
