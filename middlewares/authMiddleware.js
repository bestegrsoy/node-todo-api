const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // headers'dan token al
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];     // "Bearer TOKEN" → TOKEN
    }

    if (!token){
        return res.status(401).json({ error: 'Yetkilendirme token bulunamadı'});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // tokeni doğrula

        req.user = await User.findById(decoded.id).select('-password'); // şifre hariç
        next();
    }catch (error){
        res.status(401).json({ error: 'Token geçersiz'});
    }
};

module.exports = protect;