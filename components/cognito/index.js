var AWS = require('aws-sdk');
const config = require('config');

module.exports = cliArgs.get('fake') || process.env.NODE_ENV === 'development' ? require('./dev').cognito : new AWS.CognitoIdentityServiceProvider({
    secretAccessKey: config.get('cognito.secretAccessKey'),
    accessKeyId:  config.get('cognito.accessKeyId'),
    credentials: {IdentityPoolId: config.get('cognito.IdentityPoolId'), secretAccessKey: config.get('cognito.secretAccessKey'),
    accessKeyId:  config.get('cognito.accessKeyId')}, 
    region:  config.get('cognito.region'), 
    apiVersion:  config.get('cognito.apiVersion')    
     });