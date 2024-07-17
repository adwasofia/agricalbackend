const { Kalender } = require('../models/kalenderModel');

const getAllKegiatan = async (req, res) => {
    try {
        const kalender = await Kalender.findAll ({
            attributes: ['idkegiatan', 'username', 'jeniskegiatan', 'namakegiatan', 'catatan', 'tanggal']
        });
        if (!kalender) {
            return res.status(404).json({message: "Kalender not found."});
        }
        return res.status(200).json(kalender);
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            details: error.message
        });
    }
};

const insertKegiatan = async (req, res) => {
    const { username, jeniskegiatan, namakegiatan, catatan, tanggal } = req.body;
if (!username || !jeniskegiatan || !namakegiatan || !catatan || !tanggal) {
        return res.status(404).json({message: "Kalender not found."});
    }
    try {
        const newkegiatan = await Kalender.create({
            username: username,
            jeniskegiatan: jeniskegiatan,
            namakegiatan: namakegiatan,
            catatan: catatan,
            tanggal: tanggal
        });
        return res.status(200).json({
            message: "Satu kegiatan baru telah ditambahkan.",
            details: newkegiatan
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            details: error.message
        });
    }
};

module.exports = { getAllKegiatan, insertKegiatan };