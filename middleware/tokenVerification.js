const { jwt } = require('jsonwebtoken');

// const authenticateJWT = (req, res, next) => {
//     const token = req.headers['Authorization'];
//     //const token = authHeader && authHeader.split(' ')[1];
//     //const token = req.header('Authorization');
//     if (!token) {
//         return res.status(401).json({ message: 'Access denied' });
//     }
//     try {
//         const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//         req.user = decoded;
//         next();
//     } catch (error) {
//         res.status(400).json({ message: `Invalid token ${token}` });
//     }
// };

// interface UserData {
//     id: string;
//     name: string;
//     address: string;
// }

// interface ValidationRequest extends Request {
//     userData: UserData
// }

const authenticateJWT = (req, res, next) => {
    const {authorization} = req.headers;

    if(!authorization){
        return res.status(401).json({
            message: 'Token diperlukan'
        })
    }

    const token = authorization.split(' ')[1];
    const secret = process.env.ACCESS_TOKEN_SECRET;

    try {
        const jwtDecode = jwt.verify(token, secret);

        if(typeof jwtDecode !== 'string'){
            req.user = jwtDecode;
            next()
        }
    } catch (error) {
        return res.status(401).json({
            message: 'Unauthorized',
            token: token
        })
    }
}

module.exports = { authenticateJWT };