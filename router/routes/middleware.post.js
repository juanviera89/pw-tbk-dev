
const rfr = require('rfr');
const dblog = rfr('db/models/log.js');

const reportError = async (errObj) =>{
    const err = {
        transactionId: errObj.id,
        service: errObj.original && errObj.original.error && errObj.original.error.stack ? errObj.original.error.stack : errObj.title,
        type: 'error',
        message: errObj.title,
        comment: errObj.serializedErr,
        origin: JSON.stringify(errObj),
    }
    const log = new dblog(err)
    await log.save(); 
} // import error reporting function



const errorHandle = (err, req, res, next) => {
    const title = 'Error in ' + req.method + ' ' + req.url
    let serializedErr
    try {
        serializedErr = JSON.stringify(err)
    } catch (error) {
        if (err.toString) {
            serializedErr = err.toString()
        } else {
            serializedErr = `${err}`
        }
    } //TODO define body by code with dictionary
    let body = {
        "name": err.name ,
        "code": err.errId,
        "message": err.message,
        "help":err.help
    }
    
    const errObj = {
        id: req.transactionId,
        title,
        original: err,
         serializedErr
    }
    res.status(err.code || 500).send(body);
    if(cliArgs.get('log')) console.error(errObj)
    return reportError(errObj)
}

module.exports = [
    errorHandle
    //errorhandlerOptions,
    //require('errorhandler')(errorhandlerOptions)
]