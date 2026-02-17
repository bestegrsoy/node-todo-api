const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title zorunludur.'],
        trim: true,
        minlength: [3, 'Title en az 3 karakter olmalıdır'],
        maxlength: [100, 'Title en fazla 100 karakter olmalıdır']
    },
    completed: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,       // mongoDB id tipi
        ref: 'User',                                // User modeline referans
        required: true
    }
},{
    timestamps: true // createdAt, updatedAt otomatik
});

module.exports = mongoose.model('Todo', todoSchema);