const rfr = require('rfr');
const dblog = rfr('db/models/log.js');
const code = rfr('db/models/code.js');
const equipo = rfr('db/models/equipo.js');
const sucursal = rfr('db/models/sucursal.js');
const concesionario = rfr('db/models/concesionario.js');
const pago = rfr('db/models/pago.js');
const descuento = rfr('db/models/descuento.js');
const cognito = require('../cognito');
const config = require('config');
const errors = require('../../utils/errordictionary.json');
const oId = require('mongoose').Types.ObjectId
const utils = rfr('utils')

const list = async (req, res, next) => {
    try {
        const { page = 0, size = 10 } = req.validInputs.query;
        const userAttr = req.userInfo;
        const projection = {
            _id: 0,
            oc: 1,
            type: 1,
            amount: 1,
            equipos: 1,
            'tbk.tipo': 1,
            'tbk.exito': 1,
            'tbk.date': 1,
            'tbk.result': 1,
            createdAt: 1,
        }
        const pagosRealizados = await pago.find({
            username: userAttr.username/* , "tbk.exito": true */
        }, projection).limit(size).skip(page * size).exec();
        return res.status(200).send({ list: pagosRealizados });
    } catch (error) {
        const err = {
            errId: 500,
            transactionId: req.transactionId,
            service: 'equipo info',
            type: 'error',
            message: 'Internal server error', // TODO: Use dictionary
            origin: JSON.stringify(error),
        }
        err.error = error
        next(err);
    }
}



module.exports = { list }