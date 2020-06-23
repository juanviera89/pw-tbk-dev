const { validate } = require('./')
const wrapper = (validatorOptions) => {
    const { body, headers, parameters, query } = validatorOptions;
    const { options = {} } = validatorOptions;
    //console.log('validator middleware', validatorOptions);

    return (req, res, next) => {
        try {
            req.validInputs = {};
            //console.log('validate', req)
            let valid;
            if (body) {
                const bodyOptions = options.body || {}
                valid = validate(req.body, body, 'body', bodyOptions)
                req.validInputs.body = valid.validInput
            }
            if (headers) {
                const headersOptions = options.headers || {}
                valid = validate(req.headers, headers, 'headers', headersOptions)
                req.validInputs.headers = valid.validInput
            }
            if (parameters) {
                const parametersOptions = options.parameters || {}
                valid = validate(req.params, parameters, 'parameters', parametersOptions)
                req.validInputs.parameters = valid.validInput
            }
            if (query) {
                const queryOptions = options.query || {}
                valid = validate(req.query, query, 'query', queryOptions)
                req.validInputs.query = valid.validInput
            }
            //console.log('validated, mooving next', req.validInputs);
            if (valid.error) {
                return next( { code : 400, message : valid.message})
            }
            return next()
        } catch (error) {
            if (cliArgs.get('log')) console.error(error)
            //console.error(error)
            return next(error)
        }
    }
}

module.exports = {
    wrapper
}