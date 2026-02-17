const errorHandler = (err, req, res, next) => {
    console.error(err);

    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ error: messages });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({ error: 'Geçersiz ID formatı' });
    }

    // Duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({ error: `${field} zaten kullanımda` });
    }

    res.status(500).json({ error: 'Sunucu hatası' });
};

module.exports = errorHandler;