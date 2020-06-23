const express = require('express')
const rfr = require('rfr')
const router = express.Router();
const validate = rfr('/components/validator/middleware').wrapper
const requireCode = rfr('/components/validationCode/controller').requireCode
const validateCode = rfr('/components/validationCode/controller').validateCode

const methods = {
    GET: {
        query: {
            destination: {
                type: 'string',
                required: true
            }, 
            field: {
                type: 'string',
                required: true
            },
            search: {
                type: 'string',
                required: true
            },
            change: {
                type: 'string',
                required: false
            }
        }
    },
    PUT : {
        body: {
            codeId: {
                type: 'string',
                required: true
            }, 
            code: {
                type: 'string',
                required: true
            },
            destination: {
                type: 'string',
                required: true
            }
        }
    }
}


router.get('/', validate(methods.GET), requireCode)
router.put('/', validate(methods.PUT), validateCode)
module.exports = { methods, routes: router };