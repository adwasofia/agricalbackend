const { jwt } = require('json');

const jwtSecretWord = pr

// const { jwt } = require("jsonwebtoken");

// const verifyToken = (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
//     if (token == null) return res.status(401);
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//         if (err) return res.status(403);
//         req.email = decoded.email;
//         next();
//     })
// }

// module.exports = { verifyToken };