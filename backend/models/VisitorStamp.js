const mongoose = require('mongoose');

const visitorStampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    message: {
        type: String,
        default: 'Estive aqui!'
    },
    styleIndex: {
        type: Number,
        default: 0 // To randomize rotation/color/font on frontend
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('VisitorStamp', visitorStampSchema);
