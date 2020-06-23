const rfr = require('rfr')
const ctrl = rfr('components/version');
const express = require('express');
const router = express.Router();
const vmwr = rfr('components/validator/middleware').wrapper
const methods = {
    GET : {
    }
}



router.get('/', ctrl.version)

module.exports = {methods, routes : router};