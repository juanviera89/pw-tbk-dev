const rfr = require('rfr');
const dblog = rfr('db/models/log.js');
const code = rfr('db/models/code.js');
const cognito = require('../cognito');
const config = require('config');
const errors = require('../../utils/errordictionary.json');
const oId = require('mongoose').Types.ObjectId

const requireCode = async (req, res, next) => {
    try {
        const { destination, field, search, change } = req.validInputs.query;
        if (!(['login', 'password', 'account'].includes(destination))) return res.status(400).send({ sent: false, message: 'No code available for requested service' })
        const { Users } = await cognito.listUsers({ Filter: `${field}="${search}"` }).promise();
        if (!Users[0]) return res.status(404).send({ sent: false, message: 'User Not found' }) //TODO Centralizar errores y permitir body
        const userAttr = {
            username: Users[0].Username,
            ...(Users[0].UserAttributes || []).reduce((attrs, item, i) => {
                attrs[item.Name] = item.Value;
                return attrs
            }, {})
        }
        let method = userAttr['custom:contact'] || 'email';
        let nonValidatedCode = await code.findOne({ username: userAttr.username, validated: false, $where: "this.sent.length < 3" }).exec()
        // no se validan fechas, ya que si un codigo no fue usado hace un año, y el usuario solicita de nuevo un codigo, se reutiliza el viejo codigo, al menos dos veces mas
        // La validacion de codigos si toma en cuenta fecha, si bien podria darse el hecho de que sea enviado el mismo codigo por reutilizacion, el usuario debera usarlo dentro de cierto rango de tiempo antes de expirar y tener que solicitarlo de nuevo
        if (change) {
            if (!(['email', 'phone', 'ws'].includes(change))) return res.status(400).send({ sent: false, message: 'Contact method not available' })
            method = change;
        }
        if (['phone', 'ws'].includes(method)) {
            //validate user has phone
            const phone = userAttr['phone'];
            if (!(phone && phone.trim().length > 8)) return res.status(400).send({ sent: false, message: 'User has no phone registered' })
        }
        if (nonValidatedCode) { //si esta solicitando un codigo, pero hay uno reciclable
            const sentArr = [...(nonValidatedCode.sent || []), { method }];
            const update = await code.updateOne({ _id: oId(nonValidatedCode._id) }, { $set: { sent: sentArr } })
        } else {
            nonValidatedCode = {
                transactionId: req.transactionId,
                codeId: Date.now().toString(16) + userAttr.username,
                code: Number((Math.random()).toString().split('.')[1].substr(0, 6)),
                sent: [{ method }],
                username: userAttr.username,
                destination
            }
            const sentCode = new code(nonValidatedCode);
            await sentCode.save();
        }
        const contact = method == 'email' ?
            userAttr['email'].split('@').map((el, i) => i == 0 ? `${el.substr(0, 4)}**` : el).join('@')
            : userAttr['phone'].split('').map((el, i, arr) => i > 0 && i < arr.length - 4 ? '*' : el).join('')
        // TODO: Call send code service
        return res.status(200).send({ sent: true, codeId: nonValidatedCode.codeId, contact })

    } catch (error) {
        const err = {
            errId: 500,
            transactionId: req.transactionId,
            service: 'require code',
            type: 'error',
            message: 'Internal server error', // TODO: Use dictionary
            origin: JSON.stringify(error),
        }
        err.error = error
        return next(err);
    }
}


const validateCode = async (req, res, next) => {
    try {
        const { codeId, destination } = req.validInputs.body;
        const inputCode = req.validInputs.body.code
        const query = { codeId, code : inputCode,destination, validated : false}
        const nonValidatedCode = await code.findOne(query).exec();
        if (nonValidatedCode){
            const code5min =  (nonValidatedCode.sent.pop()).date
            code5min.setMinutes(code5min.getMinutes() + 5)
            if(code5min < (new Date()) ) return res.status(404).send({ validated: false, message : 'Code expired' });
            const update = await code.updateOne({ _id: oId(nonValidatedCode._id) }, { $set: { validated : true } })
            return res.status(200).send({ validated: true, codeId: nonValidatedCode.codeId,destination : nonValidatedCode.destination })
        }else {
            return res.status(404).send({ validated: false, message : 'Code not valid' });
        }
    } catch (error) {
        const err = {
            errId: 500,
            transactionId: req.transactionId,
            service: 'validateCode',
            type: 'error',
            message: 'Internal server error', // TODO: Use dictionary
            origin: JSON.stringify(error),
        }
        err.error = error
        return next(err);
    }
}

module.exports = { requireCode, validateCode }