const mongoose = require('mongoose');
// find({username: a , equipos: { $elemMatch: {serial : N, activated : B }}}) to find pagos for equipments
// find({username: a , equipos: { serial:N} }) seems to works as well but if need to satisfy multiple conditions in eq, have to use $elemMatch
// find({"tbk.pagoExito" : true}) to find succeded payments
const pago = new mongoose.Schema({
    oc : { type: String, required: true },
    sessionId : String,
    username: { type: String, required: true },
    entorno: { type: String, default: 'dev' }, //desarrollo -produccion
    activation: {
        status: { type: Boolean, default: false },
        date: Date
    },
    type: String,
    amount: Number,
    reversals: {
        type: [{
            amount : Number,
            date : Date,
            comments : String,
            officer : String //TODO : pending payments should query for reversals with length 0 
        }],
        default : []
    },
    equipos: {
        type: [{
            serial: String,
            price: { type: Number, required: true },
            discount: { amount : {type: Number, default: 0}, id : String },
            activated: { type: Boolean, default: false },
            sucursal: string,
            date: Date,
            eqdata : String //mqtt data response on activation
        }],
        required: true
    },
    tbk: {
        tipo: String,
        exito: Boolean,
        init: mongoose.Schema.Types.Mixed,
        result: mongoose.Schema.Types.Mixed,
        final: mongoose.Schema.Types.Mixed,
        acknoledge: mongoose.Schema.Types.Mixed,
        date: Date
    },
    createdAt: { type: Date, default: Date.now },
    /* estado: { type: Number, default: 0 },//[ 0:en_proceso_de_pago, 1:pagado, 2:no_pagado, 3:en_proceso_activacion, 4:activado, 5:lavado_terminado ]
    activacion: { activated: { type: Boolean, default: false }, respuesta: { type: String, default: '' }, contador_activaciones: { type: Number, default: 0 } },
    equipoId: mongoose.Schema.Types.ObjectId,
    tipo: String,
    monto: Number,
    descuento: { activo: Boolean, montoDescuento: { type: Number, default: 0 }, montoOriginal: { type: Number, default: 0 } },
    sucursalId: mongoose.Schema.Types.ObjectId,
    reporte: { reportado: { type: Boolean, default: false }, _id: { type: mongoose.Schema.Types.ObjectId, ref: 'reportes' } } */
});
module.exports = mongoose.model('pago', pago);
