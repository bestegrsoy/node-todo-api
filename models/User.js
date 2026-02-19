const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email gereklidir.'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Geçerli bir email giriniz']
    },
    password: {
        type: String,
        required: [true, 'Şifre gerekldidir'],
        minLength: [6, 'Şifre en az 6 karakterli olmalı']
    },
    refreshTokens: [{
        token: String,
        createdAt: {
            type: Date,
            default: Date.now
        } // refreshToken array'inin içindeki her token için createdAt istiyoruz 30 gün sonra temizlenebilsin diye
    }]
},{
    timestamps: true
});

// kaydetmeden önce hashleme
userSchema.pre('save', async function () { // pre('save') → Middleware! save() çağrılmadan önce çalışır:
    if (!this.isModified('password')) return; // isModified('password') → Şifre değişmediyse tekrar hash'leme (update'lerde)

    this.password = await bcrypt.hash(this.password, 10);
});

// şifre karşılaştırma metodu - loginde kullanmak için
userSchema.methods.comparePassword = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);