const { Kalender } = require('../models/kalenderModel');

const getAllKegiatan = async (req, res) => {
    const username = req.body.username;
    try {
        const kalender = await Kalender.findAll ({
            where: {username: username}
        });
        if (!kalender) {
            return res.status(404).json({message: "Kegiatan not found."});
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
    const { username, jeniskegiatan, namakegiatan, tanggal } = req.body;
if (!username || !jeniskegiatan || !namakegiatan || !tanggal) {
        return res.status(404).json({message: "Username, Jenis Kegiatan, Nama Kegiatan, Catatan, dan Tanggal are required."});
    }
    try {
        if (req.body.catatan) {
            const newkegiatan = await Kalender.create({
                username: username,
                jeniskegiatan: jeniskegiatan,
                namakegiatan: namakegiatan,
                catatan: req.body.catatan,
                tanggal: tanggal,
                status: 'Belum Selesai'
            });
        } else {
            const newkegiatan = await Kalender.create({
                username: username,
                jeniskegiatan: jeniskegiatan,
                namakegiatan: namakegiatan,
                tanggal: tanggal,
                status: 'Belum Selesai'
            });
        }
        return res.status(200).json({
            message: "Satu kegiatan baru telah ditambahkan."
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            details: error.message
        });
    }
};

const updateKegiatan = async (req, res) => {
    if (!req.body.username || !req.params.id) {
        return res.status(404).json({message: "Username and ID Kegiatan are required."});
    }
    const kalender = await Kalender.findByPk(req.params.id);
    if (!kalender) {
        return res.status(404).json({message: "Kegiatan not found."});
    }
    try {
        kalender.username = (req.body.username || kalender.username);
        kalender.jeniskegiatan = (req.body.jeniskegiatan || kalender.jeniskegiatan);
        kalender.namakegiatan = (req.body.namakegiatan || kalender.namakegiatan);
        kalender.catatan = (req.body.catatan || kalender.catatan);
        kalender.tanggal = (req.body.tanggal || kalender.tanggal);
        kalender.status = (req.body.status || kalender.status)
        await kalender.save();
        return res.status(200).json({
            message: "Satu kegiatan telah diperbarui.",
            details: kalender
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            details: error.message
        });
    }
};

const deleteKegiatan = async (req, res) => {
    const { username } = req.body;
    if (!username || !req.params.id) {
        return res.status(404).json({message: "Username and ID Kegiatan are required."});
    }
    try {
        const kegiatan = await Kalender.findByPk(req.params.id);
        if (kegiatan) {
            await kegiatan.destroy();
            return res.status(200).json({ message: `Kegiatan with the id=${req.params.id} is successfully deleted.` });
        } else {
            return res.status(404).json({ error: 'Kegiatan not found' });
        }
    } catch(error) {
        res.status(500).json({
            error: 'Internal server error.',
            details: error.message
        });
    }
};

module.exports = { getAllKegiatan, insertKegiatan, updateKegiatan, deleteKegiatan };