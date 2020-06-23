const express = require('express')
const rfr = require('rfr')
const router = express.Router();
const validate = rfr('/components/validator/middleware').wrapper
const changePassword = rfr('/components/user/controller').changePassword
const userInfo = rfr('/components/user/userMiddleware').userInfo


const methods = {
    POST: {
        body: {
            password: {
                type: 'string',
                required: true
            },
            codeId: {
                type: 'string',
                required: false
            }
        }
    },
    PUT: {
        body: {
            password: {
                type: 'string',
                required: true
            },
            codeId: {
                type: 'string',
                required: false
            }
        }
    }
}


router.post('/', validate(methods.POST), changePassword)
router.put('/', validate(methods.PUT),userInfo, changePassword)
module.exports = { methods, routes: router };