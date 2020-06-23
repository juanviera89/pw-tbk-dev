const mongoose = require('mongoose');

const concesionario = new mongoose.Schema({
    code: { type: String, required: true },
    name: { type: String, required: true },
    direccion : String,
    idn : String,
    techPhone : String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('concesionario', concesionario);