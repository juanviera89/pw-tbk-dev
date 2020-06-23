if (!process.env.NODE_ENV || process.env.NODE_ENV === undefined || process.env.NODE_ENV === null) require('dotenv').config();
const config = require('config')
const app = require('./app')
const server = require('./server')
global.cliArgs = new (require('./utils/args'));

const main = async () => {

  try {
    console.log('====================================');
    console.log(process.env.NODE_ENV);
    console.log(config.get('db.uri'))
    console.log(cliArgs.getAll())
    console.log('====================================');
    console.log('Connecting to DB')
    const db = require('./db');
    await db.connect()
    //db.close() // do this on gracefully process exit
    //console.log(process.env)
    console.log('Connected')
    console.log('====================================')
    console.log('Initializing routes')
    if (cliArgs.get('test')) console.log('TEST MODE: ON')
    const router = require('./router')
    const path = require("path");
    //console.log(__dirname)
    router.setDescriptionExporter( (desc) => console.log(JSON.stringify(desc)) ) //TODO: metodo para traducir a formato swagger
    app.initApp('main'); // TODO : develop healt and monitoring service
    router.initRoutes( app.getApp('main'), path.join(__dirname, 'router') )
    console.log('Starting server')
    const PORT = parseInt(process.env.PORT || config.get('server.port') || 1989)
    const HOST = process.env.HOST || config.get('server.host') || '0.0.0.0'
    await server.serverInit(app.getApp('main'), PORT, HOST)
    app.setReady('main')
    console.log(`PayWash Backend API listening: ${server.getServer(`p${PORT}`).listening} | info ${HOST}:${PORT}!`)
    console.log('====================================')
    /* await dblog.create({
      transactionId: `${cliArgs.get('debug') ? 'debug' : ''}${Date.now()}`,
      message: `PayWash Backend API listening : ${server.getServer(`p${PORT}`).listening} | info ${HOST}:${PORT}!`,
      originObject: JSON.stringify({ NODE_ENV: process.env.NODE_ENV, PORT, HOST })
    }) */

  } catch (error) {
    console.error(error);

  }

}

main()
module.exports = app;