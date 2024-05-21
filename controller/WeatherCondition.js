const { WeatherCondition } = require('../models/weatherConditionModel');
const { AccuweatherForecast } = require('../models/accuweatherForecastModel');
const { fetchData, fetchOneHourlyData, fetchTwelveHourlyData } = require('../apiaccuweather');
const { getAllLocationKey } = require('./LokasiLahan');
const nodeCron = require('node-cron');

const days = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
const months = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

const getAllWeatherCondition = async (req, res) => {
    try {
        const weathercondition = await WeatherCondition.findAll ({
            attributes: ['id', 'datetime', 'epochdatetime', 'weathericon', 'iconphrase', 'hasprecipitation', 'precipitationtype', 'precipitationintensity', 'isdaylight', 'temperaturevalue', 'temperatureunit', 'temperatureunittype', 'precipitationprobability']
        });
        res.json(weathercondition);
    } catch (error) {
        console.log(error);
    }
};

const getLatestWeatherCondition = async (req, res) => {
    try {
        const weathercondition = await WeatherCondition.findOne ({
            order: [
                ['datetime', 'DESC']
              ]
        });

        day = days[weathercondition.dateTime.getDay()];
        date = weathercondition.dateTime.getDate().toString();
        month = months[weathercondition.dateTime.getMonth()];
        year = weathercondition.dateTime.getFullYear();

        const latestweathercondition = {data: [{
            dateInfo: (`${day}, ${date} ${month} ${year}`),
            time: (`${weathercondition.dateTime.getHours()}.00`),
            weatherIcon: weathercondition.weatherIcon,
            iconPhrase: weathercondition.iconPhrase,
            temperature: (`${Math.round((weathercondition.temperatureValue - 32) * 5 / 9)}°C`)
        }]}

        res.json(latestweathercondition);
    } catch (error) {
        console.log(error);
    }
};

const insertOneHourlyWeatherCondition = async (locationKey) => {
    try {
        const locationKey = 3454195;
        const fetchedData = await fetchOneHourlyData(locationKey);

        const weathercondition = await WeatherCondition.create({ 
            dateTime: new Date(fetchedData[0].DateTime),
            epochDateTime: fetchedData[0].EpochDateTime,
            weatherIcon: fetchedData[0].WeatherIcon,
            iconPhrase: fetchedData[0].IconPhrase,
            hasPrecipitation: fetchedData[0].HasPrecipitation,
            precipitationType: (fetchedData[0].PrecipitationType || 'N/A'),
            precipitationIntensity: (fetchedData[0].PrecipitationIntensity || 'N/A'),
            isDaylight: fetchedData[0].IsDaylight,
            temperatureValue: fetchedData[0].Temperature.Value,
            temperatureUnit: fetchedData[0].Temperature.Unit,
            temperatureUnitType: fetchedData[0].Temperature.UnitType,
            precipitationProbability: fetchedData[0].PrecipitationProbability,
        });

        console.log({
            msg: 'Weather condition terbaru dari AccuWeather berhasil ditambahkan'
        });
    } catch (error) {
        console.log(error);
    }
};

const insertTwelveHourlyWeatherCondition = async (locationKey) => {
    try {
        //const locationKey = 3454195;
        const fetchedData = await fetchTwelveHourlyData(locationKey);

        const transformedData = fetchedData.map(data => ({
            dateTime: new Date(data.DateTime),
            locationKey: locationKey,
            weatherIcon: data.WeatherIcon,
            iconPhrase: data.IconPhrase,
            hasPrecipitation: data.HasPrecipitation,
            precipitationType: data.PrecipitationType || 'N/A',
            precipitationIntensity: data.PrecipitationIntensity || 'N/A',
            isDaylight: data.IsDaylight,
            temperatureValue: data.Temperature.Value,
            temperatureUnit: data.Temperature.Unit,
            temperatureUnitType: data.Temperature.UnitType,
            precipitationProbability: data.PrecipitationProbability
        }));

        const weathercondition = await AccuweatherForecast.bulkCreate(transformedData);

        console.log({
            msg: '12 Weather forecast terbaru dari AccuWeather berhasil ditambahkan'
        });
    } catch (error) {
        console.log(error);
    }
};


const updateWeatherForecast = async (req, res) => {
    try {
        const alllocationkeys = await getAllLocationKey();

        // alllocationkeys is likely an array of objects
        alllocationkeys.forEach(location => {
            //console.log(location.locationkey);
            insertTwelveHourlyWeatherCondition(location.locationkey);
        });

        res.status(200).json({ message: 'Weather forecast updated successfully' });
    } catch (error) {
        console.error('Error updating weather forecast:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

//const job = nodeCron.schedule('0 32 * * * *', insertWeatherCondition);

module.exports = { getAllWeatherCondition, getLatestWeatherCondition, insertOneHourlyWeatherCondition, insertTwelveHourlyWeatherCondition, updateWeatherForecast };