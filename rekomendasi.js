const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { DataCuaca, DataSensor, DataProduksi, DataHarga } = require('./models'); // Sesuaikan dengan model yang digunakan

const plants = ['Cabai Merah Besar', 'Cabai Keriting', 'Cabai Rawit', 'Bawang Merah'];
let rekomendasi = {};

async function rekomendasiWaktuTanam() {
  try {
    for (let plant of plants) {
      // Ambil data produksi 2023
      const produksi2023 = await DataProduksi.findAll({
        where: {
          tanaman: plant,
          tahun: 2023
        }
      });

      // Ambil data produksi 2024 (sampai bulan ini)
      const produksi2024 = await DataProduksi.findAll({
        where: {
          tanaman: plant,
          tahun: 2024
        }
      });

      // Ambil data harga 2023
      const harga2023 = await DataHarga.findAll({
        where: {
          tanaman: plant,
          tahun: 2023
        }
      });

      // Ambil data harga 2024 (sampai bulan ini)
      const harga2024 = await DataHarga.findAll({
        where: {
          tanaman: plant,
          tahun: 2024
        }
      });

      // Ambil data cuaca untuk 2024
      const cuaca2024 = await DataCuaca.findAll({
        where: {
          tahun: 2024
        }
      });

      // Ambil data sensor di lahan
      const sensorData = await DataSensor.findAll({
        where: {
          tanaman: plant,
          tahun: 2024
        }
      });

      // Hitung rata-rata produksi dan harga bulanan 2023
      const rataRataProduksi2023 = hitungRataRataBulanan(produksi2023);
      const rataRataHarga2023 = hitungRataRataBulanan(harga2023);

      // Analisis tren produksi dan harga 2024
      const trenProduksi2024 = analisisTren(produksi2024);
      const trenHarga2024 = analisisTren(harga2024);

      // Analisis kondisi cuaca optimal
      const kondisiCuacaOptimal = analisisCuaca(cuaca2024, plant);

      // Analisis kondisi sensor optimal
      const kondisiSensorOptimal = analisisSensor(sensorData, plant);

      // Evaluasi bulan terbaik untuk penanaman
      const bulanTerbaik = evaluasiBulanTerbaik(kondisiCuacaOptimal, kondisiSensorOptimal, trenProduksi2024, trenHarga2024, rataRataProduksi2023, rataRataHarga2023);

      // Simpan rekomendasi
      rekomendasi[plant] = bulanTerbaik;
    }

    return rekomendasi;
  } catch (error) {
    console.error('Error determining recommendations:', error);
    return null;
  }
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

function analisisTren(data) {
  // Contoh analisis tren sederhana
  const trends = {};
  data.forEach(entry => {
    const month = new Date(entry.date).getMonth() + 1;
    if (!trends[month]) {
      trends[month] = { total: 0, count: 0 };
    }
    trends[month].total += entry.volumeProduksi || entry.harga;
    trends[month].count++;
  });

  const trendValues = {};
  for (let month in trends) {
    trendValues[month] = trends[month].total / trends[month].count;
  }

  return trendValues;
}

function analisisCuaca(dataCuaca, plant) {
  // Analisis kondisi cuaca optimal berdasarkan data prakiraan cuaca
  const optimalMonths = [];
  dataCuaca.forEach(entry => {
    const month = new Date(entry.date).getMonth() + 1;
    if (isCuacaOptimal(entry, plant)) {
      optimalMonths.push(month);
    }
  });
  return optimalMonths;
}

function isCuacaOptimal(entry, plant) {
  // Logika untuk menentukan apakah cuaca optimal untuk penanaman
  // Sesuaikan dengan kebutuhan tanaman
  return entry.suhu >= 20 && entry.suhu <= 30 && entry.curahHujan <= 100;
}

function analisisSensor(dataSensor, plant) {
  // Analisis data sensor di lahan untuk menentukan kondisi optimal
  const optimalMonths = [];
  dataSensor.forEach(entry => {
    const month = new Date(entry.date).getMonth() + 1;
    if (isSensorOptimal(entry, plant)) {
      optimalMonths.push(month);
    }
  });
  return optimalMonths;
}

function isSensorOptimal(entry, plant) {
  // Logika untuk menentukan apakah kondisi sensor optimal untuk penanaman
  // Sesuaikan dengan kebutuhan tanaman
  return entry.kadarAir >= 30 && entry.kadarAir <= 50 && entry.kelembapan >= 60 && entry.kelembapan <= 80;
}

function evaluasiBulanTerbaik(kondisiCuacaOptimal, kondisiSensorOptimal, trenProduksi, trenHarga, rataRataProduksi, rataRataHarga) {
  // Evaluasi bulan terbaik berdasarkan analisis data yang ada
  let bestMonth = null;
  let bestScore = -Infinity;

  for (let month = 1; month <= 12; month++) {
    let score = 0;

    if (kondisiCuacaOptimal.includes(month)) score += 10;
    if (kondisiSensorOptimal.includes(month)) score += 10;
    if (trenProduksi[month] > rataRataProduksi[month]) score += 5;
    if (trenHarga[month] > rataRataHarga[month]) score += 5;

    if (score > bestScore) {
      bestScore = score;
      bestMonth = month;
    }
  }

  return bestMonth;
}

// Panggil fungsi untuk mendapatkan rekomendasi
rekomendasiWaktuTanam().then(rekomendasi => {
  console.log('Rekomendasi Waktu Tanam:', rekomendasi);
});
