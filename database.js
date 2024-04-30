import mysql from 'mysql2';
import dotenv from 'dotenv';
import fetchData from "./apiaccuweather.js";
dotenv.config()

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise()

async function getAllWeatherCondition() {
    const [rows] = await pool.query("select * from weathercondition");
    return rows;
};

export async function getWeatherCondition(id) {
    const [rows] = await pool.query(`
    SELECT * 
    FROM weatherCondition
    WHERE idCuaca = ?
    `, [id])
    return rows[0]
};

export async function getAccuWeatherConditionHourly() {
    try {
        const fetchedData = await fetchData();
        // Use the fetched data here
        console.log(fetchedData[0]);
    } catch (error) {
        console.error(error);
    }
};

// export async function createWeatherCondition(fetchedData[0].DateTime, fetchedData[0].EpochDateTime, fetchedData[0].WeatherIcon, fetchedData[0].IconPhrase, fetchedData[0].HasPrecipitation, fetchedData[0].PrecipitationType, fetchedData[0].PrecipitationIntensity, fetchedData[0].IsDaylight, fetchedData[0].Temperature.Value, fetchedData[0].Temperature.Unit, fetchedData[0].Temperature.UnitType, fetchedData[0].PrecipitationProbability) {
//     const [result] = await pool.query(`
//     INSERT INTO notes (datetime, epochdatetime, weathericon, iconphrase, hasprecipitation, precipitationtype, precipitationintensity, isdaylight, temperaturevalue, temperatureunit, temperatureunittype, precipitationprobability)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `, [fetchedData[0].DateTime, fetchedData[0].EpochDateTime, fetchedData[0].WeatherIcon, fetchedData[0].IconPhrase, fetchedData[0].HasPrecipitation, fetchedData[0].PrecipitationType, fetchedData[0].PrecipitationIntensity, fetchedData[0].IsDaylight, fetchedData[0].Temperature.Value, fetchedData[0].Temperature.Unit, fetchedData[0].Temperature.UnitType, fetchedData[0].PrecipitationProbability])
//     return result
// }

// (async () => {
//     try {
//       const fetchedData = await fetchData();
//       // Use the fetched data here
//       console.log(fetchedData[0].Temperature.Value);
//     } catch (error) {
//       console.error(error);
//     }
//   })();


// const weatherCondition = await getWeatherCondition(3)
console.log(getAccuWeatherConditionHourly())

// const notes = await getAllWeatherCondition()
// console.log(weatherConditions)