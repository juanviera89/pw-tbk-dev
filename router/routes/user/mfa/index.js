const express = require('express')
const rfr = require('rfr')
const router = express.Router();
const validate = rfr('/components/validator/middleware').wrapper
const modifyMfa = rfr('/components/user/controller').modifyMfa
const userInfo = rfr('/components/user/userMiddleware').userInfo


const methods = {
    POST: {
        body: {
            mfa: {
                type: 'boolean',
                required: false
            },
            contact: {
                type: 'string',
                required: false
            }
        }
    }
}


router.post('/', validate(methods.POST), userInfo, modifyMfa)
module.exports = { methods, routes: router };