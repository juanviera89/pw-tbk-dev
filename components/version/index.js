const pj = require('../../package.json')
const version = (req, res, next) => {
    try {
    const body = {
        version: `${pj.version}`,
        appVersion: `${pj["app-version"]}`
    }
    return res.status(200).send(body);
    } catch (error) {
        const err = {
            errId: 500,
            transactionId: req.transactionId,
            service: 'user/register',
            type: 'error',
            message: 'Internal server error', // TODO: Use dictionary
            origin: JSON.stringify(error),
        }
        err.error = error
        next(err);
    }
}

module.exports= {
    version,
    pj
}