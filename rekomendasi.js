function rekomendasiWaktuTanam(dataCuaca, dataSensor, dataProduksi2023, dataHarga2023, dataProduksi2024, dataHarga2024) {
  const plants = ['Bawang Merah', 'Cabai Merah Besar', 'Cabai Keriting', 'Cabai Rawit'];
  const rekomendasi = {};

  // Langkah 1: Memproses data produksi dan harga 2023
  const produksi2023 = hitungRataRataBulanan(dataProduksi2023);
  const harga2023 = hitungRataRataBulanan(dataHarga2023);

  // Langkah 2: Memproses data produksi dan harga 2024
  const produksi2024 = hitungRataRataBulanan(dataProduksi2024);
  const harga2024 = hitungRataRataBulanan(dataHarga2024);

  // Langkah 3: Menentukan waktu tanam yang ideal
  for (const plant of plants) {
      let bestMonth = null;
      let bestMonthValue = -Infinity;

      for (let month = 1; month <= 12; month++) {
          // Mengecek cuaca di bulan penanaman dan beberapa hari setelahnya
          if (!isCuacaIdeal(dataCuaca, dataSensor, month)) continue;

          // Mengecek harga jual 90 hari setelah penanaman, menggunakan data 2023 jika data 2024 tidak tersedia
          const panenMonth = (month + 3) % 12 || 12;
          let hargaPanen;
          if (harga2024[plant] && harga2024[plant][panenMonth]) {
              hargaPanen = harga2024[plant][panenMonth];
          } else {
              hargaPanen = harga2023[plant][panenMonth];
          }

          if (hargaPanen > bestMonthValue) {
              bestMonthValue = hargaPanen;
              bestMonth = month;
          }
      }

      rekomendasi[plant] = bestMonth;
  }

  return rekomendasi;
}

function hitungRataRataBulanan(data) {
  const monthlyTotals = {};
  data.forEach(entry => {
      const month = new Date(entry.date).getMonth() + 1;
      if (!monthlyTotals[month]) {
          monthlyTotals[month] = { total: 0, count: 0 };
      }
      monthlyTotals[month].total += entry.volumeProduksi || entry.harga;
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
  const cuaca = dataCuaca[month];
  const sensor = dataSensor[month];

  // Contoh parameter cuaca ideal: tidak hujan lebat, suhu dan kelembapan ideal
  const hujanLebat = cuaca.hujan > 50 || sensor.hujan > 50;
  const suhuIdeal = cuaca.suhu >= 20 && cuaca.suhu <= 30;
  const kelembapanIdeal = cuaca.kelembapan >= 60 && cuaca.kelembapan <= 80;

  return !hujanLebat && suhuIdeal && kelembapanIdeal;
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
const dataProduksi2024 = [
  // Data produksi untuk 2024 hingga sekarang
  { date: '2024-01-01', volumeProduksi: 110, tanaman: 'Bawang Merah' },
  // ...
];
const dataHarga2024 = [
  // Data harga untuk 2024 hingga sekarang
  { date: '2024-01-01', harga: 5200, tanaman: 'Bawang Merah' },
  // ...
];

const rekomendasi = rekomendasiWaktuTanam(dataCuaca, dataSensor, dataProduksi2023, dataHarga2023, dataProduksi2024, dataHarga2024);
console.log(rekomendasi);

