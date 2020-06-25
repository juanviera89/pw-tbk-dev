const express = require('express')
const rfr = require('rfr')
const router = express.Router();
const validate = rfr('/components/validator/middleware').wrapper
const info = rfr('/components/equipo/controller').info
const activar = rfr('/components/equipo/controller').activar
const userInfo = rfr('/components/user/userMiddleware').userInfo


const methods = {
    PUT: {
        body: {
            serials: {
                type: 'array',
                items : 'string',
                required: true
            }
        }
    },
    GET: {
        query: {
            number: {
                type: 'string',
                required: false
            },
            serial: {
                type: 'string',
                required: false
            },
            qr: {
                type: 'string',
                required: false
            }
        }
    }
}


router.get('/', validate(methods.GET), userInfo, info)
router.put('/', validate(methods.PUT), userInfo, activar)
module.exports = { methods, routes: router };