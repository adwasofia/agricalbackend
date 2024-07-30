const { Sequelize, Op } = require('sequelize');
const IrrigationSchedule = require('../models/irrigationScheduleModel');

const createIrrigationSchedule = async (req, res) => {
    try {
        const { date, time, title, waterDebit, username, status } = req.body;
        const schedule = await IrrigationSchedule.create({ date, time, title, waterDebit, username, status });
        return res.status(200).json({
            message: `New irrigation schedule is successfully added!`,
            details: schedule
        });
    } catch(error) {
        return res.status(500).json({
            message: 'Internal server error',
            details: error.message
        });
    }
};

const getAllIrrigationSchedule = async (req, res) => {
    try {
        const schedules = await IrrigationSchedule.findAll();
        return res.status(200).json(schedules);
    } catch(error) {
        return res.status(500).json({
            message: 'Internal server error',
            details: error.message
        });
    }
};

const getOneIrrigationSchedule = async (req, res) => {
    try {
        const schedule = await IrrigationSchedule.findByPk(req.params.id);
        if (schedule) {
            return res.status(200).json(schedule);
        } else {
            return res.status(404).json({ error: 'There is no schedule with that id.' });
        }
    } catch(error) {
        return res.status(500).json({
            message: 'Internal server error',
            details: error.message
        });
    }
};

const getIrrigationScheduleByUsername = async (req, res) => {
    if (!req.params.username) {
        return res.status(400).json({
            message: 'Username is required.'
        })
    }
    try {
        const schedules = await IrrigationSchedule.findAll({
            where: {username: req.params.username}
        });
        if (!schedules) {
            return res.status(404).json({
                message: 'Schedule for that username is not found.'
            })
        }
        return res.status(200).json(schedules);
    } catch(error) {
        return res.status(500).json({
            message: 'Internal server error',
            details: error.message
        });
    }
};

const updateIrrigationSchedule = async (req, res) => {
    try {
        const schedule = await IrrigationSchedule.findByPk(req.params.id);
        if (schedule) {
            schedule.date = (req.body.date || schedule.date);
            schedule.time = (req.body.time || schedule.time);
            schedule.title = (req.body.title || schedule.title);
            schedule.waterDebit = (req.body.waterDebit || schedule.waterDebit);
            schedule.status = (req.body.status || schedule.status);
            await schedule.save();
            return res.status(200).json({ 
                message: `Irrigation schedule with the id=${req.params.id} is successfully updated.`,
                details: schedule
            });
        } else {
            return res.status(404).json({
                message: 'The schedule is not found.'
            })
        }
    } catch(error) {
        return res.status(500).json({
            message: 'Internal server error',
            details: error.message
        });
    }
};

const deleteIrrigationSchedule = async (req, res) => {
    try {
        const schedule = await IrrigationSchedule.findByPk(req.params.id);
        if (schedule) {
            await schedule.destroy();
            return res.json({ message: `Irrigation schedule with the id=${req.params.id} is successfully deleted.` });
        } else {
            return res.status(404).json({ message: 'Irrigation schedule not found' });
        }
    } catch(error) {
        return res.status(500).json({
            message: 'Internal server error',
            details: error.message
        });
    }
};

module.exports = { createIrrigationSchedule, getAllIrrigationSchedule, getOneIrrigationSchedule, updateIrrigationSchedule, deleteIrrigationSchedule, getIrrigationScheduleByUsername };