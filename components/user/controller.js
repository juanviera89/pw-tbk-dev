const rfr = require('rfr');
const dblog = rfr('db/models/log.js');
const code = rfr('db/models/code.js');
const oneclick = rfr('db/models/oneclick.js')
const cognito = require('../cognito');
const config = require('config');
const errors = require('../../utils/errordictionary.json');
const validator = require('../validator');
const oId = require('mongoose').Types.ObjectId;

const getUserInfo = async (req, res, next) => {
    try {
        const userAttr = req.userInfo;
        //const now5min = new Date()
        //now5min.setDate(now5min.getMinutes() - 5);
        //if ((new validator.classValidator(userAttr['custom:mfa'])).ValidBoolean && now5min > userAttr.devices.DeviceCreateDate)
        if ((new validator.classValidator(userAttr['custom:mfa'])).ValidBoolean) {
            const query = {
                validated: true,
                username: userAttr.username,
                destination: 'login',
                "data.device": userAttr.device.DeviceKey,
                createdAt: { $gt: userAttr.device.DeviceCreateDate }
            }
            const deviceCodes = await code.find(query).exec()
            if (!(deviceCodes.length)) return res.status(403).send({ message: 'MFA challenge has not been succeded', requireMFA: true })
        } // TODO: migrar seguridad de MFA a middleware, asi endopoints estaran protegidos ante el acceso desde dispositivo desconocido
        return res.status(200).json({ ...(req['userInfo'] || {}) })
    } catch (error) {
        const log = new dblog({
            transactionId: req.transactionId,
            service: 'getUserInfo',
            type: 'error',
            message: error.message || error.code,
            origin: JSON.stringify(error),
        })
        await log.save()

        return res.status(500).send(JSON.stringify({ ...errors['Server_Error'], ReqID: req.transactionId }));
    }
}

const findUser = async (req, res, next) => {
    try {
        const { field, search } = req.validInputs.query;
        // TODO verificar si solicita desde dispositivo recordado, en caso de que no, obligar a validar codigo si necesita mfa
        const { Users } = await cognito.listUsers({ Filter: `${field}="${search}"` }).promise();
        return res.status(200).send({
            found: Users
        })
    } catch (error) {
        const err = {
            errId: 500,
            transactionId: req.transactionId,
            service: 'findUser',
            type: 'error',
            message: 'Internal server error', // TODO: Use dictionary
            origin: JSON.stringify(error),
        }
        /* const log = new dblog(err)
        await log.save(); */
        err.error = error
        next(err);
    }
}

const register = async (req, res, next) => {
    try {
        const { name, lastname, email, phone, dni, password } = req.validInputs.body;
        const { Users } = await cognito.listUsers({ Filter: `email="${email}"` }).promise();
        if(Users.length) return res.status(409).send({ message : 'Can not create specified user', code : '409' })
        const cognitoResult = await cognito.adminCreateUser({
            UserPoolId: config.get('cognito.IdentityPoolId'),
            Username: `${Date.now().toString(16)}${name}${lastname}`,
            UserAttributes: [
                { Name: 'phone', Value: phone || `` },
                { Name: 'name', Value: name },
                { Name: 'family_name', Value: lastname },
                { Name: 'email', Value: email },
                { Name: 'custom:dni', Value: dni || `` },
                { Name: 'custom:mfa', Value: `true` },
                { Name: 'custom:contact', Value: `email` }
            ],
            TemporaryPassword: password
        }).promise()
        return res.status(200).send({ user: { ...cognitoResult} })
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

const changePassword = async (req, res, next) => {
    try {
        const { codeId, password } = req.validInputs.body;
        let username;
        let mfa = true;
        let valid = false;
        if (req.userInfo) {
            username = req.userInfo.username;
            mfa = (new validator.classValidator(req.userInfo['custom:mfa'])).ValidBoolean;
        }
        let userCode
        if (mfa) {
            let query = { codeId, destination: 'password', validated: true };
            if (username) query['username'] = username;
            userCode = await code.findOne(query).exec();
            if (userCode) {
                if (userCode.used) return res.status(409).send({ updated: false, message: 'Code already used' })
                valid = userCode.validated;
                username = userCode.username;
            }
        } else {
            valid = true;
        }
        if (!valid) return res.status(403).send({ updated: false, message: 'MFA challenge has not been succeded' })
        const t = new RegExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}/);
        valid = t.test(password)
        if (!valid) {
            return res.status(400).send({
                updated: false,
                message: 'Password doesnt match required pattern'
            })
        }
        const cognitoResult = await cognito.adminSetUserPassword({
            UserPoolId: config.get(`cognito.IdentityPoolId`),
            Username: username,
            Password: password,
            Permanent: true
        }).promise()
        if (userCode) await code.update({ _id: oId(userCode['_id']) }, { $set: { used: Date.now() } })
        // TODO: send message; with mfa preferred method; to user aboout new password set
        return res.status(200).send({ updated: true, ...cognitoResult })
    } catch (error) {
        const err = {
            errId: 500,
            transactionId: req.transactionId,
            service: 'changePassword',
            type: 'error',
            message: 'Internal server error', // TODO: Use dictionary
            origin: JSON.stringify(error),
        }
        err.error = error
        next(err);

    }
}

const modifyInfo = async (req, res, next) => {
    try {
        const { name, lastname, email, phone, dni } = req.validInputs.body;
        const userAttr = req.userInfo;
        //cognitoUserInfo = await cognito.adminsPool.adminGetUser({ Username: username, UserPoolId: config.get(`cognito.IdentityPoolId`) }).promise()
        cognitoResult = await cognito.adminUpdateUserAttributes({
            UserPoolId: config.get(`cognito.IdentityPoolId`),
            Username: userAttr.username,
            UserAttributes: [
                { Name: 'phone', Value: phone || userAttr['phone'] },
                { Name: 'name', Value: name || userAttr['name'] },
                { Name: 'family_name', Value: lastname || userAttr['family_name'] },
                { Name: 'email', Value: email || userAttr['email'] },
                { Name: 'custom:dni', Value: dni || userAttr['custom:dni'] }
            ]
        }).promise();
        return res.status(200).send({ updated: true, user: cognitoResult })
    } catch (error) {
        const err = {
            errId: 500,
            transactionId: req.transactionId,
            service: 'modifyInfo',
            type: 'error',
            message: 'Internal server error', // TODO: Use dictionary
            origin: JSON.stringify(error),
        }
        err.error = error
        next(err);

    }
}


const modifyMfa = async (req, res, next) => {
    try {
        const { mfa, contact } = req.validInputs.body;
        if (contact && !(['email', 'phone', 'ws'].includes(contact))) return res.status(400).send({ updated: false, message: 'Contact method not available' })
        const userAttr = req.userInfo;
        const userOneClick = await oneclick.find({ username: userAttr.username, registered: true }).exec()
        const userMfa = (new validator.classValidator(userAttr['custom:mfa'])).ValidBoolean
        //cognitoUserInfo = await cognito.adminsPool.adminGetUser({ Username: username, UserPoolId: config.get(`cognito.IdentityPoolId`) }).promise()
        const newMfa = (mfa ? mfa : userMfa) || ((userOneClick || []).length > 0);
        cognitoResult = await cognito.adminUpdateUserAttributes({
            UserPoolId: config.get(`cognito.IdentityPoolId`),
            Username: userAttr.username,
            UserAttributes: [
                { Name: 'custom:mfa', Value: newMfa },
                { Name: 'custom:contact', Value: contact || userAttr['custom:contact'] }
            ]
        }).promise();
        return res.status(200).send({ updated: true, user: cognitoResult, mfa: newMfa });
    } catch (error) {
        const err = {
            errId: 500,
            transactionId: req.transactionId,
            service: 'modifyMfa',
            type: 'error',
            message: 'Internal server error', // TODO: Use dictionary
            origin: JSON.stringify(error),
        }
        err.error = error
        next(err);

    }
}



module.exports = { getUserInfo, findUser, register, changePassword, modifyInfo, modifyMfa }