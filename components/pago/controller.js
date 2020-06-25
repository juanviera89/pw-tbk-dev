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

const startPayment = async (req, res, next) => { //Solicita pago
    try {
      const { equipos, tipo } = req.validInputs.body;
      if (!['webpay', 'oneclick'].includes(tipo)) return res.status(400).send({ message: 'Payment type not supported', oc: null })
      const userAttr = req.userInfo;
      if (tipo == 'oneclick') {
        const userOneclick = await oneclick.findOne({ username: userAttr.username, registered: true }).exec();
        if (!userOneclick) return res.status(400).send({ message: 'Method not available', needRegistration: true, oc: null })
      }
      const eqs = [];
      for (const eq of equipos) {
        const foundEq = await equipo.findOne({ serial: eq });
        if (!foundEq) return res.status(404).send({ message: `Can't process payment. Equipment not found`, oc: null });
        const foundSucursal = await sucursal.findOne({ code: foundEquipo.sucursal }).exec();
        const foundDescuentos = await descuento.find({ sucursales: foundSucursal.code, iDate: { $lt: Date.now() }, eDate: { $gt: Date.now() }, active: true }, { _id: 0 }).exec()
        const descuentoEqs = foundDescuentos.filter(desc => {
          if (!desc.schedule) return true;
          return utils.testDate(desc.schedule)
        }).reduce((descFinal, desc) => {
          if (!descFinal) return desc;
          if (desc.descuento[foundEquipo.type] > descFinal.descuento[foundEquipo.type]) return desc
          return descFinal
        }, null);
        if (!foundSucursal.precio[foundEq.type]) return res.status(500).send({ message: 'error with equipment price', oc: null })
        const pagoEq = {
          serial: foundEq.serial,
          price: foundSucursal.precio[foundEq.type],
          sucursal: foundSucursal.code
        }
        if (descuentoEqs) pagoEq['discount'] = {
          amount: descuentoEqs.descuento[foundEq.type],
          id: descuentoEqs.did
        }
        eqs.push(pagoEq);
      }
      if (!eqs.length) return res.status(400).send({ message: `Can't process payment. No equipments`, oc: null });
      const price = eqs.reduce((amount, eq, i) => amount + eq.price + eq.discount ? eq.discount.amount : 0, 0);
      const oc = `pwoc${Date.now().toString(24)}`
      const sid = `pwsid${Date.now().toString(24)}`
      const doc = {
        oc,
        sessionId: sid,
        username: userAttr.username,
        entorno: process.env.NODE_ENV,
        type: tipo,
        amount: price,
        equipos: eqs
      }
      return res.status(200).send({ oc, tipo })
  
  
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

module.exports = { list , startPayment}