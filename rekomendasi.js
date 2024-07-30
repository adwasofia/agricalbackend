const DataPasar = require("./models/dataPasarModel");
const { Kalender } = require("./models/kalenderModel");
const { DailyForecast } = require("./models/dailyForecastModel");
const { KondisiLahan } = require("./models/kondisiLahanModel");
const { Sequelize, Op } = require('sequelize');

const monthlyRecommendation = async (req, res) => {
  const currentDate = new Date();
  const plants = ['Bawang Merah', 'Cabai Besar', 'Cabai Keriting', 'Cabai Rawit'];
  const rekomendasi = {};

  try {
    for (const plant of plants) {
      const lastYearProduction = await DataPasar.findAll({
        attributes: ['date', 'volumeProduksi'],
        where: {
          tanaman: plant,
          date: {
            [Op.between]: [new Date(currentDate.getFullYear()-1, 0, 1), new Date(currentDate.getFullYear()-1, 12, 0)]
          }
        }
      });

      const lastYearPrice = await DataPasar.findAll({
        attributes: ['date', 'hargaJual'],
        where: {
          tanaman: plant,
          date: {
            [Op.between]: [new Date(currentDate.getFullYear()-1, 0, 1), new Date(currentDate.getFullYear()-1, 12, 0)]
          }
        }
      });
  
      const averageProduction2023 = hitungRataRata(lastYearProduction, 'volumeProduksi');
      const averagePrice2023 = hitungRataRata(lastYearPrice, 'hargaJual');
      const monthlyProduction2023 = hitungRataRataBulanan(lastYearProduction, 'volumeProduksi');
      const monthlyPrice2023 = hitungRataRataBulanan(lastYearPrice, 'hargaJual');
      console.log(averageProduction2023);
      console.log(averagePrice2023);
  
      for (let month = 1; month <= 12; month++) {
        const panenMonth = (month + 3) % 12 || 12;
        const hargaSaatPanen = monthlyPrice2023[panenMonth];
        const produksiSaatPanen = monthlyProduction2023[panenMonth];
        if ((hargaSaatPanen >= averagePrice2023) && (produksiSaatPanen <=averageProduction2023)) {
          const tanggalKegiatan = month < 10 
            ? `${currentDate.getFullYear()}-0${month}-01` 
            : `${currentDate.getFullYear()}-${month}-01`;
          const newkegiatan = await Kalender.create({
            username: 'admin',
            jeniskegiatan: 'Tanam',
            namakegiatan: `Disarankan menanam ${plant} di bulan ini karena saat panen (3 bulan dari sekarang) kemungkinan nilai jualnya akan cukup tinggi.`,
            catatan: 'Rekomendasi ini diberikan berdasarkan data pasar di tahun sebelumnya.',
            tanggal: tanggalKegiatan
          });
        } else {
          console.log("Tidak ada rekomendasi yang dapat diberikan");
        }
      }
    }
    res.status(200).json({
      message: "Adding monthly recommendation succeed!"
    });
  } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        details: error.message
      });
    }
}

const every3daysRecommendation = async (req, res) => {
  const currentDate = new Date();
  console.log(currentDate);
  const plants = ['Bawang Merah', 'Cabai Besar', 'Cabai Keriting', 'Cabai Rawit'];
  const rekomendasi = {};

  try {
    const locationKey = req.params.locationKey;
    for (const plant of plants) {
      const lastYearProduction = await DataPasar.findAll({
        attributes: ['date', 'volumeProduksi'],
        where: {
          tanaman: plant,
          date: {
            [Op.between]: [new Date(currentDate.getFullYear()-1, 0, 1), new Date(currentDate.getFullYear()-1, 12, 0)]
          }
        }
      });

      const lastYearPrice = await DataPasar.findAll({
        attributes: ['date', 'hargaJual'],
        where: {
          tanaman: plant,
          date: {
            [Op.between]: [new Date(currentDate.getFullYear()-1, 0, 1), new Date(currentDate.getFullYear()-1, 12, 0)]
          }
        }
      });

      const threeDaysLater = new Date(currentDate);
      const oneDayEarlier  = new Date(currentDate);
      threeDaysLater.setDate(currentDate.getDate() + 3);
      oneDayEarlier.setDate(currentDate.getDate() - 1)

      const forecasts = await DailyForecast.findAll({
        where: {
          locationKey: locationKey,
          dateTime: {
            [Op.between]: [oneDayEarlier, threeDaysLater]
          }
        }
      });
  
      const averageProduction2023 = hitungRataRata(lastYearProduction, 'volumeProduksi');
      const averagePrice2023 = hitungRataRata(lastYearPrice, 'hargaJual');
      const monthlyProduction2023 = hitungRataRataBulanan(lastYearProduction, 'volumeProduksi');
      const monthlyPrice2023 = hitungRataRataBulanan(lastYearPrice, 'hargaJual');
      const forecastsIdeal = isForecastsIdeal(forecasts);
  
      const month = currentDate.getMonth();
      const panenMonth = (month + 3) % 12 || 12;
      const hargaSaatPanen = monthlyPrice2023[panenMonth];
      const produksiSaatPanen = monthlyProduction2023[panenMonth];
      if ((hargaSaatPanen >= averagePrice2023) && (produksiSaatPanen <=averageProduction2023) && forecastsIdeal) {
        const tanggalKegiatan = currentDate;
        const newkegiatan = await Kalender.create({
          username: `${locationKey}`,
          jeniskegiatan: 'Tanam',
          namakegiatan: `Disarankan menanam ${plant} pada hari ini dan 2 hari kedepan karena cuacanya cukup mendukung dan saat panen (3 bulan dari sekarang) kemungkinan nilai jualnya akan cukup tinggi.`,
          catatan: 'Rekomendasi ini diberikan berdasarkan data prakiraan cuaca hari ini dan 2 hari kedepan, serta data pasar di tahun sebelumnya.',
          tanggal: tanggalKegiatan
        });
      } else {
        console.log("Tidak ada rekomendasi yang dapat diberikan");
      }
    }
    res.status(200).json({
      message: "Adding every-3-days-recommendation succeed!"
    });
  } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        details: error.message
      });
    }
}

const dailyRecommendation = async (req, res) => {
  const currentDate = new Date();
  console.log(currentDate);
  const plants = ['Bawang Merah', 'Cabai Besar', 'Cabai Keriting', 'Cabai Rawit'];

  try {
    const locationKey = req.params.locationKey;
    for (const plant of plants) {
      const lastYearProduction = await DataPasar.findAll({
        attributes: ['date', 'volumeProduksi'],
        where: {
          tanaman: plant,
          date: {
            [Op.between]: [new Date(currentDate.getFullYear()-1, 0, 1), new Date(currentDate.getFullYear()-1, 12, 0)]
          }
        }
      });

      const lastYearPrice = await DataPasar.findAll({
        attributes: ['date', 'hargaJual'],
        where: {
          tanaman: plant,
          date: {
            [Op.between]: [new Date(currentDate.getFullYear()-1, 0, 1), new Date(currentDate.getFullYear()-1, 12, 0)]
          }
        }
      });

      const threeDaysLater = new Date(currentDate);
      const oneDayEarlier  = new Date(currentDate);
      threeDaysLater.setDate(currentDate.getDate() + 3);
      oneDayEarlier.setDate(currentDate.getDate() - 1)

      const forecasts = await DailyForecast.findAll({
        where: {
          locationKey: locationKey,
          dateTime: {
            [Op.between]: [oneDayEarlier, threeDaysLater]
          }
        }
      });

      const thisYearPasar = await DataPasar.findAll({
        where: {
          tanaman: plant
        },
        order: [['date', 'DESC']],
        limit: 3
      });
      
      console.log(`This year pasar: ${thisYearPasar}`);

      const sensorTerkini = await KondisiLahan.findOne({
        where: {
          time: '09:00:00'
        },
        order: [
            ['date', 'DESC']
        ]
      });

      console.log(`Sensor terkini: ${sensorTerkini}`);
  
      const averageProduction2023 = hitungRataRata(lastYearProduction, 'volumeProduksi');
      const averagePrice2023 = hitungRataRata(lastYearPrice, 'hargaJual');
      const monthlyProduction2023 = hitungRataRataBulanan(lastYearProduction, 'volumeProduksi');
      const monthlyPrice2023 = hitungRataRataBulanan(lastYearPrice, 'hargaJual');
      const forecastsIdeal = isForecastsIdeal(forecasts);
      const pasarIdeal = isPasarIdeal(thisYearPasar);
      const sensorIdeal = isSensorIdeal(sensorTerkini);
      console.log(`Forecasts ideal: ${forecastsIdeal}`);
      console.log(`Pasar 2024 ideal: ${pasarIdeal}`);
      console.log(`Sensor ideal: ${sensorIdeal}`);
  
      const month = currentDate.getMonth();
      const panenMonth = (month + 3) % 12 || 12;
      const hargaSaatPanen = monthlyPrice2023[panenMonth];
      const produksiSaatPanen = monthlyProduction2023[panenMonth];
      if ((hargaSaatPanen >= averagePrice2023) && (produksiSaatPanen <=averageProduction2023) && forecastsIdeal && pasarIdeal && sensorIdeal) {
        const tanggalKegiatan = currentDate;
        const newkegiatan = await Kalender.create({
          username: `${locationKey}`,
          jeniskegiatan: 'Tanam',
          namakegiatan: `Disarankan menanam ${plant} pada hari ini dan 2 hari kedepan karena cuacanya cukup mendukung dan saat panen (3 bulan dari sekarang) kemungkinan nilai jualnya akan cukup tinggi.`,
          catatan: 'Rekomendasi ini diberikan berdasarkan data sensor terkini, prakiraan cuaca hari ini dan 2 hari kedepan, data pasar terkini, serta data pasar di tahun sebelumnya.',
          tanggal: tanggalKegiatan
        });
      } else {
        console.log("Tidak ada rekomendasi yang dapat diberikan");
      }
    }
    res.status(200).json({
      message: "Adding daily recommendation succeed!"
    });
  } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        details: error.message
      });
    }
}

function hitungRataRata(data, field) {
  let total = 0;
  let count = 0;
  data.forEach(entry => {
    const value = parseFloat(entry[field]);
    if (!isNaN(value)) {
      total += value;
      count++;
    }
  });
  const average = count > 0 ? total / count : 0;
  //console.log(`Average ${field}:`, average);
  return average;
}

function isForecastsIdeal (data) {
  let result = true;
  data.forEach(entry => {
    let dayHasPrecipitation = entry['dayHasPrecipitation'];
    let nightHasPrecipitation = entry['nightHasPrecipitation'];
    let minTemperatureValue = Math.round((parseFloat(entry['minTemperatureValue']) - 32) * 5 / 9);
    let maxTemperatureValue = Math.round((parseFloat(entry['maxTemperatureValue']) - 32) * 5 / 9);
    console.log(entry['dateTime']);
    console.log(dayHasPrecipitation);
    console.log(nightHasPrecipitation);
    console.log(minTemperatureValue);
    console.log(maxTemperatureValue);
    if ((dayHasPrecipitation === true) || (nightHasPrecipitation === true) || (minTemperatureValue < 18) || (maxTemperatureValue > 30)) {
      result = false;
    }
  });
  console.log(`Result isForecastsIdeal = ${result}`);
  return result;
}

function isPasarIdeal (data) {
  let result = true;
  for (let i = 0; i < 2; i++) {
    console.log(`Date = ${data[i]['date']}, Volume Produksi = ${data[i]['volumeProduksi']}, Harga Jual = ${data[i]['hargaJual']}`);
    if ((data[i]['volumeProduksi'] > data[i+1]['volumeProduksi']) || (data[i]['hargaJual'] < data[i+1]['hargaJual'])) {
      result = false;
    }
  }
  console.log(`Date = ${data[2]['date']}, Volume Produksi = ${data[2]['volumeProduksi']}, Harga Jual = ${data[2]['hargaJual']}`);
  console.log(`Result isPasarIdeal = ${result}`);
  return result;
}

function isSensorIdeal (data) {
  let result = true;
  console.log(`Rain amount = ${data['rainAmount']}, Temperature = ${data['temperature']}, Moisture = ${data['moisture']}`);
  if ((data['rainAmount'] > 0) || (data['temperature'] < 18) || (data['temperature'] > 30) || (data['moisture'] < 60) || (data['moisture'] > 80)) {
    result = false;
  }
  console.log(`Result isSensorIdeal = ${result}`);
  return result;
}

function hitungRataRataBulanan(data, field) {
  const monthlyTotals = {};
  data.forEach(entry => {
    const month = new Date(entry.date).getMonth() + 1;
    if (!monthlyTotals[month]) {
      monthlyTotals[month] = { total: 0, count: 0 };
    }
    const value = parseFloat(entry[field]);
    if (!isNaN(value)) {
      monthlyTotals[month].total += value;
      monthlyTotals[month].count++;
    }
  });
  const monthlyAverages = {};
  for (let month in monthlyTotals) {
    monthlyAverages[month] = monthlyTotals[month].count > 0 ? monthlyTotals[month].total / monthlyTotals[month].count : 0;
    //console.log(`Average ${field} for month ${month}:`, monthlyAverages[month]);
  }
  return monthlyAverages;
}

// function isCuacaIdeal(dataCuaca, dataSensor, month) {
//   // Mengecek data prakiraan cuaca dan data sensor
//   // const cuaca = dataCuaca[month];
//   // const sensor = dataSensor[month];
//   // const dailyforecasts = await 

//   // // Contoh parameter cuaca ideal: tidak hujan lebat, suhu dan kelembapan ideal
//   // // const hujanLebat = cuaca.hujan > 50 || sensor.hujan > 50;
//   // // const suhuIdeal = cuaca.suhu >= 20 && cuaca.suhu <= 30;
//   // // const kelembapanIdeal = cuaca.kelembapan >= 60 && cuaca.kelembapan <= 80;
//   // const kondisiLahanIdeal = (sensor.temperature >= 18) && (sensor.temperature <= 30) && (sensor.moisture >= 60) && (sensor.moisture <= 80) && (sensor.rainAmount == 0);
//   // const forecastsIdeal = 

//   // return !hujanLebat && suhuIdeal && kelembapanIdeal;
// }

// Contoh penggunaan:
// const dataCuaca = { /* data prakiraan cuaca untuk 2024 */ };
// const dataSensor = { /* data sensor dari lahan */ };
// const dataProduksi2023 = [
//   // Data produksi untuk 2023
//   { date: '2023-01-01', volumeProduksi: 100, tanaman: 'Bawang Merah' },
//   // ...
// ];
// const dataHarga2023 = [
//   // Data harga untuk 2023
//   { date: '2023-01-01', harga: 5000, tanaman: 'Bawang Merah' },
//   // ...
// ];
// // const dataProduksi2024 = [
// //   // Data produksi untuk 2024 hingga sekarang
// //   { date: '2024-01-01', volumeProduksi: 110, tanaman: 'Bawang Merah' },
// //   // ...
// // ];
// const dataHarga2024 = [
//   // Data harga untuk 2024 hingga sekarang
//   { date: '2024-01-01', harga: 5200, tanaman: 'Bawang Merah' },
//   // ...
// ];

// const rekomendasi = rekomendasiWaktuTanam(dataCuaca, dataSensor, dataProduksi2023, dataHarga2023, dataProduksi2024, dataHarga2024);
// console.log(rekomendasi);

// const ratarata = rekomendasiWaktuTanam();
// console.log(ratarata);

module.exports = { monthlyRecommendation, every3daysRecommendation, dailyRecommendation };