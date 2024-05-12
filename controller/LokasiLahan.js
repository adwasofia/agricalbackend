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

module.exports = { getAllLokasiLahan };