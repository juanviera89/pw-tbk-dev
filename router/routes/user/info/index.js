const express = require('express')
const rfr = require('rfr')
const router = express.Router();
const validate = rfr('/components/validator/middleware').wrapper
const findUser = rfr('/components/user/controller').findUser


const methods = {
    GET: {
        query: {
            field: {
                type: 'string',
                required: true
            },
            search: {
                type: 'string',
                required: true
            }
        }
    }
}


router.get('/', validate(methods.GET), findUser)
module.exports = { methods, routes: router };