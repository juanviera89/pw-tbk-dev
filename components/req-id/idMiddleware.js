const reqId = (req, res, next) => {
    const _id = `${cliArgs.get('debug') ? 'debug' : ''}${Date.now()}`;
    req['transactionId'] = _id;
    return next();
}

module.exports = {reqId}