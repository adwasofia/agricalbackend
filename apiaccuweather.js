import fetch from "node-fetch";
import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config()

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise()

const apiKey = process.env.AccuWeatherAPIkey;
const apiUrl = 'http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/3454195';

// Append the API key as a query parameter to the URL
const urlWithApiKey = `${apiUrl}?apikey=${apiKey}`;

// Define a function to fetch data
const fetchData = () => {
  return fetch(urlWithApiKey, {})
    .then(response => response.json());
};

export default fetchData; // Export the fetchData function