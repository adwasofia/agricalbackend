const { Users } = require("../models/userModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { cast } = require("sequelize");
const axios = require("axios");

const getUsers = async (req, res) => {
    try {
        const users = await Users.findAll({
            attributes: ['firstname', 'lastName', 'username', 'email', 'password']
        });
        res.json(users);
    } catch (error) {
        console.log(error);
    }
};

const register = async (req, res) => {
    const { firstName, lastName, username, email, password, punyaAlat, lokasiLahan } = req.body;
    const salt = 10;
    const hashPass = await bcrypt.hash(password, salt);
    const emailExists = await Users.findOne({ where: { email: req.body.email } });
    if (!firstName) {
        return res.status(400).json({ msg: "Nama depan tidak boleh kosong" });
    } else {
        if (!lastName) {
            return res.status(400).json({ msg: "Nama belakang tidak boleh kosong" });
        } else {
            if (!password) {
                return res.status(400).json({ msg: "Password tidak boleh kosong" });
            } else {
                if (!email) {
                    return res.status(400).json({ msg: "Email tidak boleh kosong" });
                } else {
                    if (!username) {
                        return res.status(400).json({ msg: "Username tidak boleh kosong" });
                    } else {
                        if (emailExists) {
                            return res.status(400).json({ msg: "Email Sudah Terdaftar" });
                        }
                    }
                }
            }
        }
    }
    
    try {
        await Users.create({
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: email,
            password: hashPass,
            punyaAlat: punyaAlat,
            lokasiLahan: lokasiLahan
        })
        res.json({ msg: "Register berhasil dilakukan" })
    } catch (error) {
        console.log(error);
    }
};

const login = async (req, res) => {
    try {
        // First try to find the user by username
        let user = await Users.findOne({
            where: { username: req.body.username }
        });
 
        // If user is not found by username, try to find by email
        if (!user) {
            user = await Users.findOne({
                where: { email: req.body.username }
            });
        }

        // If user is still not found, return an error
        if (!user) {
            return res.status(400).json({
                error: true,
                msg: "User tidak ditemukan"
            });
        }

        // Compare the provided password with the stored hash
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) {
            return res.status(400).json({
                error: true,
                msg: (`Password salah, req body: ${req.body.password}, user pass: ${user.password}`)
            });
        }

        // If password matches, generate access and refresh tokens
        const username = user.username;
        const email = user.email;
        const punyaAlat = user.punyaAlat;
        const accessToken = jwt.sign(
            { username, email, punyaAlat },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );
        const refreshToken = jwt.sign(
            { username, email, punyaAlat },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        // Update the user's refresh token in the database
        await Users.update({ refreshToken: refreshToken }, {
            where: { username: username }
        });

        // Respond with the tokens and user information
        res.status(200).json({
            error: false,
            msg: "Login berhasil dilakukan",
            loginResult: {
                email,
                username,
                punyaAlat,
                accessToken,
                refreshToken
            }
        });

    } catch (error) {
        console.error(error);  // Log the error for debugging
        res.status(500).json({
            error: true,
            msg: 'Internal server error',
            details: error.message
        });
    }
};

module.exports = { getUsers, register, login };