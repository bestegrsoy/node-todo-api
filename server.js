require('dotenv').config();
require('express-async-errors'); // hata yakalamak için


const express = require('express');
// const mongoose = require('mongoose');
const todoRoutes = require('./routes/todoRoutes');
const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/authRoutes');
const connectDB = require('./config/db');


const app = express();
app.use(express.json());

connectDB();


app.use('/todos', todoRoutes);
app.use('/auth', authRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000; //
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});

// npm install express-async-errors 