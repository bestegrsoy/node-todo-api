const { compare } = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
    return jwt.sign({ id: userId}, process.env.JWT_SECRET, {
        expiresIn: '7d' // 7 gün geçerli
    });
};

exports.register = async (req, res) => {
    const { email, password } = req.body;

    const user = await new User({ email, password }).save();
    const token = generateToken(user._id);

    res.status(201).json({
        message: 'Kullanıcı oluşturuldu',
        token,
        user: { id: user._id, email: user.email}
    });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({email});
    if (!user){
        return res.status(401).json({error: "Email ya da şifre hatalı"});
    }
    
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch){
        return res.status(401).json({error: "Şifre hatalı!"});
    }


    const token = generateToken(user._id);
    res.json({
        token,
        user: {id: user._id, email: user.email}
    });
};