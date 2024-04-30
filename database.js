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
        // console.log(fetchedData[0]);
        const datetime = fetchedData[0].DateTime;
        const epochdatetime = fetchedData[0].EpochDateTime;
        const weathericon = fetchedData[0].WeatherIcon;
        const iconphrase = fetchedData[0].IconPhrase;
        const hasprecipitation = fetchedData[0].HasPrecipitation;
        const precipitationtype = (fetchedData[0].PrecipitationType || 'N/A');
        const precipitationintensity = (fetchedData[0].PrecipitationIntensiti || 'N/A');
        const isdaylight = fetchedData[0].IsDaylight;
        const temperaturevalue = fetchedData[0].Temperature.Value;
        const temperatureunit = fetchedData[0].Temperature.Unit;
        const temperatureunittype = fetchedData[0].Temperature.UnitType;
        const precipitationprobability = fetchedData[0].PrecipitationProbability;
        // console.log(precipitationintensity);
        createWeatherCondition(datetime, epochdatetime, weathericon, iconphrase, hasprecipitation, precipitationtype, precipitationintensity, isdaylight, temperaturevalue, temperatureunit, temperatureunittype, precipitationprobability);
    } catch (error) {
        console.error(error);
    }
};

export async function createWeatherCondition(datetime, epochdatetime, weathericon, iconphrase, hasprecipitation, precipitationtype, precipitationintensity, isdaylight, temperaturevalue, temperatureunit, temperatureunittype, precipitationprobability) {
    const [result] = await pool.query(`
    INSERT INTO accuweathercondition (datetime, epochdatetime, weathericon, iconphrase, hasprecipitation, precipitationtype, precipitationintensity, isdaylight, temperaturevalue, temperatureunit, temperatureunittype, precipitationprobability)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [datetime, epochdatetime, weathericon, iconphrase, hasprecipitation, precipitationtype, precipitationintensity, isdaylight, temperaturevalue, temperatureunit, temperatureunittype, precipitationprobability])
    return result
}

// INSERT INTO WeatherForecast 
//   (DateTime, EpochDateTime, WeatherIcon, IconPhrase, HasPrecipitation, PrecipitationType, PrecipitationIntensity, IsDaylight, TemperatureValue, TemperatureUnit, TemperatureUnitType, PrecipitationProbability, MobileLink, Link)
//   VALUES (?, ?, ?, ?, ?, IFNULL(?, 'N/A'), IFNULL(?, 'N/A'), ?, ?, ?, ?, ?, ?, ?)

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
console.log(getAccuWeatherConditionHourly());
// console.log(precipitationintensity);

// const notes = await getAllWeatherCondition()
// console.log(weatherConditions)