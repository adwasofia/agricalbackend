const DataPasar = require("./models/dataPasarModel");
const {Kalender} = require("./models/kalenderModel");
const { Sequelize, Op } = require('sequelize');

const monthlyRecommendation = async () => {
  const currentDate = new Date();
  const plants = ['Bawang Merah', 'Cabai Besar', 'Cabai Keriting', 'Cabai Rawit'];
  const rekomendasi = {};

  // Langkah 3: Menentukan waktu tanam yang ideal
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

    const averageProduction2023 = hitungRataRata(lastYearProduction);
    const averagePrice2023 = hitungRataRata(lastYearPrice);
    const monthlyProduction2023 = hitungRataRataBulanan(lastYearProduction);
    const monthlyPrice2023 = hitungRataRataBulanan(lastYearPrice);

    const lastRecord = await DataPasar.findOne({
      attributes: ['date', 'volumeProduksi', 'hargaJual'],
      where: {
        tanaman: plant
      },
      order: [
        ['date', 'DESC']
      ]
    });

    const lastRecordDate = lastRecord.date;

    for (let month = (currentDate.getMonth()-1); month <= (lastRecordDate.getMonth()-4); month++) {
      //     // Mengecek cuaca di bulan penanaman dan beberapa hari setelahnya
      //     if (!isCuacaIdeal(dataCuaca, dataSensor, month)) continue;

          // Mengecek harga jual 90 hari setelah penanaman, menggunakan data 2023 jika data 2024 tidak tersedia
      const panenMonth = (month + 3);
      const hargaSaatPanen = monthlyPrice2023[panenMonth];
      const produksiSaatPanen = monthlyProduction2023[panenMonth];
      if ((hargaSaatPanen >= averagePrice2023) && (produksiSaatPanen <=averageProduction2023)) {
        if (panenMonth < 10) {
          const tanggalKegiatan = `${currentDate.getFullYear()}-0${panenMonth}-01`;
        } else {
          const tanggalKegiatan = `${currentDate.getFullYear()}-${panenMonth}-01`;
        }
        const newkegiatan = await Kalender.create({
          username: 'admin',
          jeniskegiatan: 'Tanam',
          namakegiatan: `Disarankan menanam ${plant} di bulan ini karena saat panen (3 bulan dari sekarang) kemungkinan nilai jualnya akan cukup tinggi.`,
          catatan: 'Rekomendasi ini diberikan berdasarkan data pasar di tahun sebelumnya.',
          tanggal: tanggalKegiatan
        });
      }

  }
}

const rekomendasiWaktuTanam = async () => {
  const plants = ['Bawang Merah', 'Cabai Besar', 'Cabai Keriting', 'Cabai Rawit'];
  const rekomendasi = {};

  // Langkah 3: Menentukan waktu tanam yang ideal
  for (const plant of plants) {
      const dataProduksi2023 = await DataPasar.findAll({
        attributes: ['date', 'volumeProduksi'],
        where: {
          tanaman: plant,
          date: {
            [Op.between]: [new Date(2023, 0, 1), new Date(2023, 12, 0)]
          }
        }
      });
      const dataProduksi2024 = await DataPasar.findAll({
        attributes: ['date', 'volumeProduksi'],
        where: {
          tanaman: plant,
          date: {
            [Op.between]: [new Date(2024, 0, 1), new Date(2024, 12, 0)]
          }
        }
      });
      const dataHarga2023 = await DataPasar.findAll({
        attributes: ['date', 'hargaJual'],
        where: {
          tanaman: plant,
          date: {
            [Op.between]: [new Date(2023, 0, 1), new Date(2023, 12, 0)]
          }
        }
      });
      const dataHarga2024 = await DataPasar.findAll({
        attributes: ['date', 'hargaJual'],
        where: {
          tanaman: plant,
          date: {
            [Op.between]: [new Date(2024, 0, 1), new Date(2024, 12, 0)]
          }
        }
      });
      // Langkah 1: Memproses data produksi dan harga 2023
      const averageProduction2023 = hitungRataRata(dataProduksi2023);
      const averagePrice2023 = hitungRataRata(dataHarga2023);
      const monthlyProduction2023 = hitungRataRataBulanan(dataProduksi2023);
      const monthlyPrice2023 = hitungRataRataBulanan(dataHarga2023);
      console.log(produksi2023);
      console.log(harga2023);

      // Langkah 2: Memproses data produksi dan harga 2024
      // const produksi2024 = hitungRataRataBulanan(dataProduksi2024);
      // const harga2024 = hitungRataRataBulanan(dataHarga2024);
      let bestMonth = null;
      let bestMonthValue = -Infinity;

      for (let month = 1; month <= 12; month++) {
      //     // Mengecek cuaca di bulan penanaman dan beberapa hari setelahnya
      //     if (!isCuacaIdeal(dataCuaca, dataSensor, month)) continue;

          // Mengecek harga jual 90 hari setelah penanaman, menggunakan data 2023 jika data 2024 tidak tersedia
          const panenMonth = (month + 3) % 12 || 12;
          let hargaPanen;
          // if (harga2024[plant] && harga2024[plant][panenMonth]) {
          //     hargaPanen = harga2024[plant][panenMonth];
          // } else {
          //     hargaPanen = harga2023[plant][panenMonth];
          // }
          hargaPanen = harga2023[panenMonth];

          if (hargaPanen > bestMonthValue) {
              bestMonthValue = hargaPanen;
              bestMonth = month;
          }
      }
      rekomendasi[plant] = bestMonth;
      // rekomendasi[plant] = produksi2024;
    }
    console.log(rekomendasi);

    return rekomendasi;
  }

function hitungRataRata(data) {
  const totals = {};
  data.forEach(entry => {
    totals.total += entry.volumeProduksi || entry.hargaJual;
    totals.count++;
  });
  const average = totals.total / totals.count;
  return average;
}

function hitungRataRataBulanan(data) {
  const monthlyTotals = {};
  data.forEach(entry => {
      const month = new Date(entry.date).getMonth() + 1;
      if (!monthlyTotals[month]) {
          monthlyTotals[month] = { total: 0, count: 0 };
      }
      monthlyTotals[month].total += entry.volumeProduksi || entry.hargaJual;
      monthlyTotals[month].count++;
  });

  const monthlyAverages = {};
  for (let month in monthlyTotals) {
      monthlyAverages[month] = monthlyTotals[month].total / monthlyTotals[month].count;
  }

  return monthlyAverages;
}


function isCuacaIdeal(dataCuaca, dataSensor, month) {
  // Mengecek data prakiraan cuaca dan data sensor
  // const cuaca = dataCuaca[month];
  // const sensor = dataSensor[month];
  // const dailyforecasts = await 

  // // Contoh parameter cuaca ideal: tidak hujan lebat, suhu dan kelembapan ideal
  // // const hujanLebat = cuaca.hujan > 50 || sensor.hujan > 50;
  // // const suhuIdeal = cuaca.suhu >= 20 && cuaca.suhu <= 30;
  // // const kelembapanIdeal = cuaca.kelembapan >= 60 && cuaca.kelembapan <= 80;
  // const kondisiLahanIdeal = (sensor.temperature >= 18) && (sensor.temperature <= 30) && (sensor.moisture >= 60) && (sensor.moisture <= 80) && (sensor.rainAmount == 0);
  // const forecastsIdeal = 

  // return !hujanLebat && suhuIdeal && kelembapanIdeal;
}

// Contoh penggunaan:
const dataCuaca = { /* data prakiraan cuaca untuk 2024 */ };
const dataSensor = { /* data sensor dari lahan */ };
const dataProduksi2023 = [
  // Data produksi untuk 2023
  { date: '2023-01-01', volumeProduksi: 100, tanaman: 'Bawang Merah' },
  // ...
];
const dataHarga2023 = [
  // Data harga untuk 2023
  { date: '2023-01-01', harga: 5000, tanaman: 'Bawang Merah' },
  // ...
];
// const dataProduksi2024 = [
//   // Data produksi untuk 2024 hingga sekarang
//   { date: '2024-01-01', volumeProduksi: 110, tanaman: 'Bawang Merah' },
//   // ...
// ];
const dataHarga2024 = [
  // Data harga untuk 2024 hingga sekarang
  { date: '2024-01-01', harga: 5200, tanaman: 'Bawang Merah' },
  // ...
];

// const rekomendasi = rekomendasiWaktuTanam(dataCuaca, dataSensor, dataProduksi2023, dataHarga2023, dataProduksi2024, dataHarga2024);
// console.log(rekomendasi);

const ratarata = rekomendasiWaktuTanam();
console.log(ratarata);