const rfr = require('rfr');
//const dba = require('./dba');
const cognito = require('../cognito');
const config = require('config');
const jwt = require('jsonwebtoken');
const oneclick = rfr('db/models/oneclick.js')
const dblog = rfr('db/models/log.js')
const errors = require('../../utils/errordictionary.json');
const userInfo = async (req, res, next) => {
    try {
        //const username = req.get('username');
        const accessToken = req.get('userkey'); //session.accessToken.jwtToken
        const DeviceKey = req.get('devkey'); //session.accessToken.payload.device_key
        //set header devkey: memory.userSession.getAccessToken().payload.device_key
        if (!DeviceKey || !accessToken) {
            const log = new dblog({
                transactionId: req.transactionId,
                service: 'userMidleware',
                type: 'security',
                message: 'No_Credentials_Provided',
                origin: JSON.stringify({headers : req.headers, body : req.body, query: req.query, params: req.params}),
            })
            await log.save()
            return res.status(403).send({ ...errors['No_Credentials_Provided'], ReqID: req.transactionId });
        }
        const cognitoUserAttr =  await cognito.getUser({ AccessToken: accessToken }).promise() ;
        // TODO: refinar si el error es por falta de usuario o por falla en codigo. HU Cognito
        const currentDevice = await cognito.getDevice({ AccessToken: accessToken, DeviceKey }).promise() 
        //TODO: Error al buscar dispositivo?
        const cognitoUsername = cognitoUserAttr.Username
        const userAttr = {
            username: cognitoUsername,
            ...(cognitoUserAttr.UserAttributes || []).reduce((attrs, item, i) => {
                attrs[item.Name] = item.Value;
                return attrs
            }, {})
        }
        const userOneClick = await oneclick.find({ username: cognitoUsername, registered: true }).exec()
        userAttr['custom:mfa'] = userAttr['custom:mfa'] || (userOneClick || []).length > 0
        /* (cognitoUserAttr.UserAttributes || []).reduce( (email,userAttr,i) => {
            if ( userAttr.Name == 'email' ) return userAttr.Value;
            return email
        }, '' ) */
        /* console.log('==========userInfo=======cognitoUserAttr===================');
        console.log(accessToken, cognitoUserAttr, cognitoUsername);
        console.log('===================================='); */
        //await dba.updateActivity(!(cliArgs.get('test') || false) ? cognitoUsername : username);
        // TODO: log user acces 
        req['userInfo'] = {
            ...(req['userInfo'] || {}),
            ...userAttr,
            device : currentDevice
        };
        res.set('userinfo', jwt.sign(JSON.stringify(userAttr), config.get('infoSecret')))
        return next();
    } catch (error) {
        const log = new dblog({
            transactionId: req.transactionId,
            service: 'userMidleware',
            type: 'error',
            message: error.message || error.code,
            origin: JSON.stringify(error),
        })
        await log.save()
        /* await dblog.create({
            transactionId: , message: ,
            originObject: JSON.stringify(error),
            isError: true
        }) */
        if (process.env.NODE_ENV === 'local' || cliArgs.get('test') || cliArgs.get('log')) console.error(req.transactionId, error)
        return next();
    }
}


module.exports = { userInfo }