const mongoose = require('mongoose');

const equipo = new mongoose.Schema({
    number: { type: String, required: true },
    serial: { type: String, required: true },
    qr: { type: String, required: true },
    type: { type: String, required: true }, // lavadora, secadora
    version: { type: Number, default: 1 },
    sucursal : { type: String, required: true },
    active:  { type: Boolean, default: true },
    brand: String,
    model: String,
    createdAt: { type: Date, default: Date.now },
    ultimaVez: {
        fecha: Date,
        data: String
    },
    pulseOverlay : {
        overlay : {type : Boolean, default : false},
        monto : Number
    }
});

module.exports = mongoose.model('equipo', equipo);