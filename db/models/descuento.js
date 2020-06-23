const mongoose = require('mongoose');

const descuento = new mongoose.Schema({
    did: { type: String, default : `dsc${ Date.now().toString(16)}` },
    name: { type: String, required: true },
    description: String,
    active: { type: Boolean, default: true },
    descuento: {
        lavadora: Number,
        secadora: Number
    },
    iDate: { type: Date, required: true },
    eDate: { type: Date, required: true },
    schedule: String,
    sucursales: { type: [String], required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('descuento', descuento);