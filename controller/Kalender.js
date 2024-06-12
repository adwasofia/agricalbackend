const { Kalender } = require('../models/kalenderModel');

const getAllKegiatan = async (req, res) => {
    try {
        const kalender = await Kalender.findAll ({
            attributes: ['idkegiatan', 'tanggal', 'detailkegiatan', 'username']
        });
        res.json(kalender);
    } catch (error) {
        console.log(error);
    }
};

const insertKegiatan = async (req, res) => {
    try {
        const newkegiatan = await Kalender.create({
            tanggal: new Date(),
            detailkegiatan: req.body.detailkegiatan,
            username: req.body.username
        });

        res.status(200).json({
            msg: `Satu kegiatan baru dari username ${req.body.username} telah ditambahkan.`
        });
    } catch (error) {
        console.log(error);
    }
};

module.exports = { getAllKegiatan, insertKegiatan };