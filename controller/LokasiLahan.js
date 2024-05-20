const { LokasiLahan } = require('../models/lokasiLahanModel');

const getAllLokasiLahan = async (req, res) => {
    try {
        const lokasilahan = await LokasiLahan.findAll ({
            attributes: ['idlahan', 'lokasi']
        });
        console.log(lokasilahan);
    } catch (error) {
        console.log(error);
    }
};

const getAllLocationKey = async () => {
    try {
        const locations = await LokasiLahan.findAll({
            attributes: ['locationkey']
        });
        return locations;
    } catch (error) {
        console.error('Error fetching location keys:', error);
        throw error;
    }
};

// const addLokasiLahan = async (req, res) => {
//     const { lokasi } = req.body;
//     try {
//         const lokasilahan = await LokasiLahan
//     }
// };

module.exports = { getAllLokasiLahan, getAllLocationKey };