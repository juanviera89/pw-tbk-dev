const express = require('express')
const rfr = require('rfr')
const router = express.Router();
const userInfo = rfr('/components/user/userMiddleware').userInfo
const getUserInfo = rfr('/components/user/controller').getUserInfo
const register = rfr('/components/user/controller').register
const modifyInfo = rfr('/components/user/controller').modifyInfo
const validate = rfr('/components/validator/middleware').wrapper


const methods = {
    GET: {
        headers : {
            userkey : {
                type: 'string',
                required: true
            }
        }
    },
    PUT: {
        body: {
            name: {
                type: 'string',
                required: true
            },
            lastname: {
                type: 'string',
                required: true
            },
            email: {
                type: 'string',
                required: true
            },
            password: {
                type: 'string',
                required: true
            },
            phone: {
                type: 'string'
            },
            dni: {
                type: 'string'
            }
        }
    },
    POST: {
        body: {
            name: {
                type: 'string',
                required: false
            },
            lastname: {
                type: 'string',
                required: false
            },
            email: {
                type: 'string',
                required: false
            },
            password: {
                type: 'string',
                required: false
            },
            phone: {
                type: 'string'
            },
            dni: {
                type: 'string'
            }
        }
    }
}

router.get('/', /* validate(methods.GET), */ userInfo, getUserInfo)
router.put('/', validate(methods.PUT), register)
router.post('/', validate(methods.POST), userInfo, modifyInfo)

module.exports = { methods, routes: router };