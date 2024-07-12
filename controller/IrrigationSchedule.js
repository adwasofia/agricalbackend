const { Sequelize, Op } = require('sequelize');
const DataPasar = require('../models/irrigationScheduleModel');

const createIrrigationSchedule = async (req, res) => {
    try {
        const { date, time, title, waterDebit } = req.body;
        const schedule = await IrrigationSchedule.create({ date, time, title, waterDebit });
        res.status(200).json( { message: `New irrigation schedule is successfully added! /n ${schedule}`});
    } catch(error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const getAllIrrigationSchedule = async (req, res) => {
    try {
        const schedules = await IrrigationSchedule.findAll();
        res.status(200).json(schedules);
    } catch(error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const getOneIrrigationSchedule = async (req, res) => {
    try {
        const schedule = await IrrigationSchedule.findByPk(req.params.id);
        if (schedule) {
            res.status(200).json(schedule);
        } else {
            res.status(404).json({ error: 'There is no schedule with that id.' });
        }
    } catch(error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const updateIrrigationSchedule = async (req, res) => {
    try {
        const { date, time, title, waterDebit } = req.body;
        const schedule = await IrrigationSchedule.findByPk(req.params.id);
        if (schedule) {
            schedule.date = date;
            schedule.time = time;
            schedule.title = title;
            schedule.waterDebit = waterDebit;
            await schedule.save();
            res.status(200).json( { message: `Irrigation schedule with the id=${req.params.id} is successfully updated to this schedule: /n ${schedule}`} );
        } else {
            res.status(404).json({ error: 'Irrigation schedule not found.' });
        }
    } catch(error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const deleteIrrigationSchedule = async (req, res) => {
    try {
        const schedule = await IrrigationSchedule.findByPk(req.params.id);
        if (schedule) {
            await schedule.destroy();
            res.json({ message: `Irrigation schedule with the id=${req.params.id} is successfully deleted.` });
        } else {
            res.status(404).json({ error: 'Irrigation schedule not found' });
        }
    } catch(error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};

module.exports = { createIrrigationSchedule, getAllIrrigationSchedule, getOneIrrigationSchedule, updateIrrigationSchedule, deleteIrrigationSchedule };