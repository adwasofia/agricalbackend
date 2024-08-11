const { setIrrigationStatus } = require("../iotClient");
const { KondisiLahan } = require('../models/kondisiLahanModel');
//const {  } = require("./KondisiLahan");

async function updateIrrigationStatus(newstatus) {
    const kondisilahan = await KondisiLahan.findOne({
        order: [
            ['date', 'DESC'],
            ['time', 'DESC']
        ]
    });
    if (!kondisilahan) {
        return console.log("Latest kondisi lahan is not found, cannot update irrigation status.");
    }
    try {
        kondisilahan.date = kondisilahan.date,
        kondisilahan.time = kondisilahan.time,
        kondisilahan.voltage = kondisilahan.voltage,
        kondisilahan.lux = kondisilahan.lux,
        kondisilahan.solarRadiation = kondisilahan.solarRadiation,
        kondisilahan.humidity = kondisilahan.humidity,
        kondisilahan.temperature = kondisilahan.temperature,
        kondisilahan.pressure = kondisilahan.pressure,
        kondisilahan.windSpeed = kondisilahan.windSpeed,
        kondisilahan.windDirection = kondisilahan.windDirection,
        kondisilahan.windGust = kondisilahan.windGust,
        kondisilahan.rainAmount = kondisilahan.rainAmount,
        kondisilahan.statusIrigasi = newstatus,
        kondisilahan.waterLevel = kondisilahan.waterLevel,
        kondisilahan.moisture = kondisilahan.moisture,
        kondisilahan.isEmergency = kondisilahan.isEmergency
        await kondisilahan.save();
        return console.log("Status irigasi telah diperbarui.");
    } catch {
        return console.log("Internal server error");
    }
}

// Switch the irrigation status
const switchIrrigationStatus = async (req, res) => {
    const newstatus = req.params.status;
    if (!newstatus) {
        return res.status(400).json({
            message: "Status is required."
        })
    }
    try {
        if (newstatus == "on") {
            setIrrigationStatus(true);
            updateIrrigationStatus(true);
            return res.status(200).json({
                message: "Irrigation status is successfully switched to ON!"
            });
        } else if (newstatus == "off") {
            setIrrigationStatus(false);
            updateIrrigationStatus(false);
            return res.status(200).json({
                message: "Irrigation status is successfully switched to OFF!"
            });
        } else {
            return res.status(404).json({
                message: "Valid status are on or off."
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            details: error.message
        });
    }
}

module.exports = { switchIrrigationStatus };