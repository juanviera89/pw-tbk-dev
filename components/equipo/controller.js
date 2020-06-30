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

const info = async (req, res, next) => {
    try {
        // TODO: hacerlo para lista de ids de equipo
        const { number, serial, qr } = req.validInputs.query;
        if (!number && !serial && !qr) return res.status(400).send({ equipo: null, message: 'No search param specified for equipment' })
        const userAttr = req.userInfo;
        const query = {}
        if (number) {
            query.number = number;
        } else if (serial) {
            query.serial = serial;
        } else {
            query.qr = qr;
        }
        const foundEquipo = await equipo.findOne(query, { _id: 0 }).exec();
        if (!foundEquipo) return res.status(404).send({ equipo: null, message: 'Equipo no encontrado' })
        const hace2min = new Date()
        hace2min.setMinutes(hace2min.getMinutes() - 2);
        const activo = new Date(foundEquipo.ultimaVez.fecha) > hace2min;
        if (!(activo && foundEquipo.active)) return res.status(409).send({ message: 'Equipo no disponible o fuera de linea', equipo: { ...foundEquipo['_doc'], active: false } })
        const foundSucursal = await sucursal.findOne({ code: foundEquipo.sucursal }, { _id: 0 }).exec();
        if (!foundSucursal) return res.status(404).send({ equipo: null, message: 'Equipo no encontrado' })
        const foundConcesionario = await concesionario.findOne({ code: foundSucursal.consecionario }, { _id: 0 }).exec();
        let techPhone;
        if (foundSucursal.techPhone && foundSucursal.techPhone.trim().length) techPhone = foundSucursal.techPhone;
        if (!techPhone && foundConcesionario && foundConcesionario.techPhone && foundConcesionario.techPhone.trim().length) techPhone = foundConcesionario.techPhone;
        if (!techPhone) techPhone = config.get('techPhone') //TODO Configurar
        //TODO: Validar si el equipo fue activado recientemente, en cuyo caso se debiese notificar como no disponible
        const pagosPendientes = await pago.find({ username: userAttr.username, "tbk.exito": true, equipos: { $elemMatch: { serial: foundEquipo.serial, activated: false } } }, { _id: 0 }).exec()
        // TODO: report if there ara more than one payment pending
        let foundDescuentos = await descuento.find({ sucursales: foundSucursal.code, iDate: { $lt: Date.now() }, eDate: { $gt: Date.now() }, active: true }, { _id: 0 }).exec()
        foundDescuentos = foundDescuentos.filter(desc => {
            if (!desc.schedule) return true;
            return utils.testDate(desc.schedule)
        }).reduce((descFinal, desc) => {
            if (!descFinal) return desc;
            if (desc.descuento[foundEquipo.type] > descFinal.descuento[foundEquipo.type]) return desc
            return descFinal
        }, null);
        const body = {
            equipo: {
                ...foundEquipo['_doc'],
                active: true,
                sucursal: {
                    ...foundSucursal['_doc'],
                    consecionario: {
                        ...foundConcesionario['_doc']
                    }
                },
                techPhone,
                precio: foundSucursal.precio[foundEquipo.type]
            },
            descuento: foundDescuentos ? foundDescuentos['_doc'] : null,
            pagosPendientes: pagosPendientes.map(p => ({ oc: p.oc }))
        }
        return res.status(200).send(body)

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

const activationProcess = async (serial, username) => {
    try {
        const query = { serial }
        const foundEquipo = await equipo.findOne(query).exec();
        if (!foundEquipo) return { status: 404, activated: false, equipo: null, message: 'Equipo no encontrado' }//res.status(404).send({ activated: false,equipo: null, message: 'Equipo no encontrado' })
        const hace2min = new Date()
        hace2min.setMinutes(hace2min.getMinutes() - 2);
        const activo = new Date(foundEquipo.ultimaVez.fecha) > hace2min;
        if (!(activo && foundEquipo.active)) return { status: 409, activated: false, message: 'Equipo no disponible o fuera de linea', equipo: { ...foundEquipo['_doc'], active: false } }//res.status(409).send({activated: false, message: 'Equipo no disponible o fuera de linea', equipo :  {...foundEquipo['_doc'], active:false}})
        const now24h = new Date()
        now24h.setHours(now24h.getHours() - 24);
        const pagosPendientes = await pago.find({ username, "tbk.exito": true, equipos: { $elemMatch: { serial: foundEquipo.serial, activated: false } } , createdAt : { $gt : now24h } }).exec()
        if (!pagosPendientes.length) return { status: 403, activated: false, message: 'No tiene autorizado activar el equipo', equipo: null }//res.status(403).send({ activated: false, message: 'No tiene autorizado activar el equipo',equipo: null })
        const activacion = {} // call activation service
        //TODO: Registro de acciones
        for (const pagoPend of pagosPendientes) {
            const index = pagoPend.equipos.findIndex(eq => eq.serial == serial)
            if (index >= 0) {
                const update = {};
                update[`equipos.${index}.activated`] = true;
                update[`equipos.${index}.date`] = Date.now();
                await pago.updateOne({ _id: oId(pagoPend['_id']) }, { $set: { ...update } }).exec();
                break
            }
        }
        return { status: 200, activated: true, equipo: { ...foundEquipo['_doc'], activacion } }//res.status(200).send({ activated: true, equipo :  {...foundEquipo['_doc'], active:false}});
    } catch (error) {
        // TODO log activation error
        return { status: 500, activated: false, equipo: null };
    }
}

const activateList = async (serials, username) => {
    const eqs = []
    for (const serial of serials) {
        const eq = await activationProcess(serial, username);
        eqs.push(eq)
    }
    const { activated, error } = eqs.reduce((status, eq, i) => ({ activated: eq.activated || status.activated, error: eq.status != 200 || status.error }), { activated: false, error: false });
    return { activated, error, equipos: eqs }
}

const activar = async (req, res, next) => {
    try {
        const { serials } = req.validInputs.body;
        const userAttr = req.userInfo;
        const { activated, error, equipos } = await activateList(serials, userAttr.username)
        return res.status(200).send({ activated, error, equipos });
    } catch (error) {
        const err = {
            errId: 500,
            transactionId: req.transactionId,
            service: 'activar equipo',
            type: 'error',
            message: 'Internal server error', // TODO: Use dictionary
            origin: JSON.stringify(error),
        }
        err.error = error
        next(err);
    }
}



module.exports = { info, activar, activationProcess, activateList }