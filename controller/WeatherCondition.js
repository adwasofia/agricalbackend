const { WeatherCondition } = require('../models/weatherConditionModel');
const { fetchData } = require('../apiaccuweather');

const getAllWeatherCondition = async (req, res) => {
    try {
        const weathercondition = await WeatherCondition.findAll ({
            attributes: ['id', 'datetime', 'epochdatetime', 'weathericon', 'iconphrase', 'hasprecipitation', 'precipitationtype', 'precipitationintensity', 'isdaylight', 'temperaturevalue', 'temperatureunit', 'temperatureunittype', 'precipitationprobability']
        });
        console.log(weathercondition);
    } catch (error) {
        console.log(error);
    }
};

const insertWeatherCondition = async (req, res) => {
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
        const precipitationintensity = (fetchedData[0].PrecipitationIntensity || 'N/A');
        const isdaylight = fetchedData[0].IsDaylight;
        const temperaturevalue = fetchedData[0].Temperature.Value;
        const temperatureunit = fetchedData[0].Temperature.Unit;
        const temperatureunittype = fetchedData[0].Temperature.UnitType;
        const precipitationprobability = fetchedData[0].PrecipitationProbability;

        console.log(datetime);

        const weathercondition = await WeatherCondition.create({ 
            //dateTime: datetime,
            epochDateTime: epochdatetime,
            weatherIcon: weathericon,
            iconPhrase: iconphrase,
            hasPrecipitation: hasprecipitation,
            precipitationType: precipitationtype,
            precipitationIntensity: precipitationintensity,
            isDaylight: isdaylight,
            temperatureValue: temperaturevalue,
            temperatureUnit: temperatureunit,
            temperatureUnitType: temperatureunittype,
            precipitationProbability: precipitationprobability,
        });
        //await weathercondition.save();
    } catch (error) {
        console.log(error);
    }
};

// export async function createWeatherCondition(datetime, epochdatetime, weathericon, iconphrase, hasprecipitation, precipitationtype, precipitationintensity, isdaylight, temperaturevalue, temperatureunit, temperatureunittype, precipitationprobability) {
//     const [result] = await pool.query(`
//     INSERT INTO accuweathercondition (datetime, epochdatetime, weathericon, iconphrase, hasprecipitation, precipitationtype, precipitationintensity, isdaylight, temperaturevalue, temperatureunit, temperatureunittype, precipitationprobability)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `, [datetime, epochdatetime, weathericon, iconphrase, hasprecipitation, precipitationtype, precipitationintensity, isdaylight, temperaturevalue, temperatureunit, temperatureunittype, precipitationprobability])
//     return result
// };

// // Create a new user
// const jane = await User.create({ firstName: 'Jane', lastName: 'Doe' });
// // by this point, the user has been saved to the database!
// console.log("Jane's auto-generated ID:", jane.id);

module.exports = { getAllWeatherCondition, insertWeatherCondition };