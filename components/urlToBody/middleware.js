const queryToBody = (req, res, next) => {
    try {
        const newBody = { ...req.query }
        req.body = { ...req.body, urlQuery : newBody };
        return next();

    } catch (error) {
         dblog.create({
            transactionId: req.transactionId, message: error.message || `Unkown Error @queryToBody`,
            originObject: JSON.stringify(error),
            isError: true
        })
        if (process.env.NODE_ENV === 'local') console.error(req.transactionId, error)
        return next();
    }
}

module.exports = { queryToBody }

const { lstatSync, readdirSync } = require('fs')
const { join } = require('path')

const isDirectory = source => lstatSync(source).isDirectory()
const getDirectories = source =>
  readdirSync(source).map(name => join(source, name)).filter(isDirectory)
