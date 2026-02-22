if (process.env.NODE_ENV === 'test') {
    require('dotenv').config({ path: '.env.test' });
} else {
    require('dotenv').config();
}

// require('express-async-errors'); // hata yakalamak için

const express = require('express');
const todoRoutes = require('./routes/todoRoutes');
const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/authRoutes');

const connectDB = require('./config/db');

// Production 
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 dakika
    max: 100,                   // 15 dakikada max 100 istek
    message: { error: 'Çok fazla istek attınız, lütfen bekleyin.' }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,  // 15 dakikada max 10 login denemesi
    message: { error: 'Çok fazla giriş denemesi, lütfen bekleyin.' }
});

const app = express();
app.use(express.json());

connectDB();

app.use(morgan('dev'))  // her isteği cterminale loglar. Debug için  POST /auth/login 200 229.264 ms - 250 
app.use(helmet());      // Helmet (Security Headers), Otomatik güvenlik header'ları ekler. XSS, clickjacking gibi saldırılara karşı koruma.
app.use(cors({
    origin: '*'          // Geliştirme ortamı için
})); 
app.use(limiter);


/*app.use(cors({
    origin: process.env.CLIENT_URL  // CLIENT_URL=http://localhost:3001 
}));*/    
// Tarayıcılar güvenlik için farklı origin'den gelen istekleri engeller. Yani frontendden 3001 portla gelen istek engellenir.
// app.use(cors()) → "Herkesten istek kabul et" demek. Herkese açmak tehlikeli olacağından sadece kendi frontendimize izin veriyoruz.

app.use('/todos', todoRoutes);
app.use('/auth', authLimiter);
app.use('/auth', authRoutes);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test'){ // Jest çalıştığında otomatik NODE_ENV=test yapıyor.
    // yani test gelmediği sürece port kısmına girip normal çalışır.
    const PORT = process.env.PORT || 3000; 
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`);
    });
}

// Her instance'a unique ID ver
const os = require('os');
const instanceId = os.hostname();  // Container hostname

app.get('/health', (req, res) => {
    res.json({ 
        instance: instanceId,
        uptime: Math.floor(process.uptime())
    });
}); // load balancing test için

/*setTimeout(() => {
    throw new Error('Test crash!');
}, 5000);  // 5 saniye sonra crash */

module.exports = app;  // Test için export et
