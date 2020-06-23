const mongoose = require('mongoose');

const log = new mongoose.Schema({
    transactionId: { type: String },
    service: { type: String, default: 'system' },
    type: { type: String, default: 'simplelog' },
    message: { type: String },
    comment: { type: String },
    origin: { type: String },
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('log', log);