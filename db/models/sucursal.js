const mongoose = require('mongoose');

const sucursal = new mongoose.Schema({
    consecionario: { type: String, required: true },
    code: { type: String, required: true },
    name: { type: String, required: true },
    edificio: { type: String, required: true },
    direccion: { type: String, required: true },
    comuna: { type: String, required: true },
    precio: {
        lavadora: { type: Number, required: true },
        secadora: { type: Number, required: true }
    },
    techPhone: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('sucursal', sucursal);