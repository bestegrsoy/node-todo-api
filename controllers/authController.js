const { compare } = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');


const generateTokens = (userId) => {
    const accessToken = jwt.sign({ id: userId}, process.env.JWT_SECRET, {
        expiresIn: '15m'
    });

    const refreshToken = jwt.sign({ id: userId}, process.env.REFRESH_SECRET, {
        expiresIn: '30d'
    });

    return {accessToken, refreshToken};
};

exports.refresh = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken){
        return res.status(401).json({error: 'Refresh token gerekli.'});
    }
    
    try{
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
        
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(403).json({ error: 'Kullanıcı bulunamadı' });
        }
        
        // Token array'de var mı?
        const tokenExists = user.refreshTokens.find(rt => rt.token === refreshToken);
        if (!tokenExists) {
            return res.status(403).json({ error: 'Geçersiz refresh token' });
        }

        // 3. Yeni accessToken üret
        const { accessToken } = generateTokens(user._id);
        res.json({ accessToken });   
    } catch (error) {
        console.log('Refresh error:', error.message);
        return res.status(403).json({ error: 'Token geçersiz' });
    }

};

exports.register = async (req, res) => {
    const { email, password } = req.body;

    const user = await new User({ email, password }).save();
    const { accessToken, refreshToken } = generateTokens(user._id);

    user.refreshTokens.push({ token: refreshToken});
    await user.save();

    res.status(201).json({
        message: 'Kullanıcı oluşturuldu',
        accessToken,
        refreshToken,
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

    const { accessToken, refreshToken } = generateTokens(user._id);

    user.refreshTokens.push({ token: refreshToken});
    await user.save();

    res.json({
        accessToken,
        refreshToken,
        user: {id: user._id, email: user.email}
    });
};

exports.logout = async (req, res) => {
    const { refreshToken } = req.body;
    
    if (!refreshToken){
        return res.status(400).json({error: 'Refresh token gerekli'});
    }

    try{
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
            
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(403).json({ error: 'Kullanıcı bulunamadı' });
        }
    
        user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== refreshToken);
        await user.save();

        res.json({message: 'Logout başarılı'});
    }catch (error){
        return res.status(403).json({ error: 'Token geçersiz'});
    }
};
