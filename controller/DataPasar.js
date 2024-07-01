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
              return (averageHarga);
            })
            .catch(error => {
              console.error('Error fetching average prodution volume:', error);
            });
    } catch (error) {
        console.error(error);
    }
};

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
        const formattedData = highestVolumePlant.map(data => ({
            tanaman: data.tanaman,
            volumePenjualan: Math.round(data.volumeProduksi)
        }));
        res.json(formattedData);
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
                        )
                    ]
                }
            },
            order: [['hargaJual', 'DESC']],
            limit: 1
        });
        const formattedData = highestHargaJualPlant.map(data => ({
            tanaman: data.tanaman,
            hargaJual: Math.round(data.hargaJual)
        }));
        res.json(formattedData);
        res.json(highestHargaJualPlant);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Internal server error' });
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
      // Get the production volume for the future date
      const futureVolume = await DataPasar.findOne({
        attributes: ['volumeProduksi'],
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

      const futureVolumeValue = futureVolume ? futureVolume.get('volumeProduksi') : null;

      // Get the average production volume
      const averageVolumeValue = avgVolumeProduksi(plant);

      //const averageVolumeValue = averageVolume ? averageVolume.get('averageVolumeProduksi') : null;

      // Determine recommendation
      if (futureVolumeValue !== null && averageVolumeValue !== null) {
        recommendations[plant] = futureVolumeValue < averageVolumeValue;
      } else {
        recommendations[plant] = false; // or null, or another way to indicate missing data
      }
    }

    return recommendations;
  } catch (error) {
    console.error('Error determining recommendations:', error);
    return null;
  }
};

// Usage example:
// isRecommendedToPlant('2024-01-01').then(recommendations => {
//   console.log('Recommendations:', recommendations);
// });

const getRecommendation = async (req, res) => {
    try {
        const recommendation = isRecommendedToPlant('2024-06-24');
        res.json(recommendation);
    } catch(error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = { getLatestVolume, getHighestVolume, getHighestPrice, avgVolumeProduksi, avgHargaJual, isRecommendedToPlant, getRecommendation };
