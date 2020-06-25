const express = require('express')
const rfr = require('rfr')
const router = express.Router();
const validate = rfr('/components/validator/middleware').wrapper
const list = rfr('/components/pago/controller').list
const startPayment = rfr('/components/pago/controller').startPayment
const userInfo = rfr('/components/user/userMiddleware').userInfo


const methods = {
    GET: {
        query: {
            page: {
                type: 'string',
                required: false
            },
            size: {
                type: 'string',
                required: false
            }
        }
    },
    PUT: {
        body: {
            equipos: {
                type: 'array',
                items: 'string',
                required: true
            },
            tipo: {
                type: 'string',
                required: true
            }
        }
    }
}


router.get('/', validate(methods.GET), userInfo, list)
router.put('/', validate(methods.PUT), userInfo, startPayment)
module.exports = { methods, routes: router };