const express = require('express')
const rfr = require('rfr')
const router = express.Router();
const validate = rfr('/components/validator/middleware').wrapper
const list = rfr('/components/pago/controller').list
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
    }
}


router.get('/', validate(methods.GET), userInfo, list)
module.exports = { methods, routes: router };