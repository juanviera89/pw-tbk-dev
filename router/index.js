const rfr = require('rfr')
const express = require("express");
const { getDirectories, getFiles, isFunction } = rfr('/utils')
const path = require("path");

const notFoundDefault = (req, res) => {
  res.status(404).send('Not Found')
}

let routesDescriptionExportCB = (description) => null

const setDescriptionExporter = (fx) => {
  if (isFunction(fx)) {
    routesDescriptionExportCB = fx;
    return true
  }
  return false
}
// TODO: considerar rutas definidas internamente a traves de path en router. 
// TODO: Set pre and post midlewares
const initRoutes = (app, dir = __dirname, express = require("express"), notFound = notFoundDefault) => {
  const routes = routesAssembler(express, path.join(dir, 'routes'), notFound);
  app.use('/', routes.routes);
  routesDescriptionExportCB(routes.description);
}

const routesAssembler = (express = express, baseRoute = __dirname, notFound = notFound) => {
  const router = express.Router();
  //console.log(router.prototype.constructor.name)
  const dirs = getDirectories(baseRoute);
  const files = getFiles(baseRoute);
  const description = {};
  description.methods = {}
  if (files.includes('middleware.pre.js')) {
    const midlewares = require(path.join(baseRoute, 'middleware.pre.js'))
    for (const mw of midlewares) {
      router.use(mw)
    }
  }
  if (files.includes('index.js')) {
    const rt = require(path.join(baseRoute, 'index.js'));
    //methods.push.apply(methods, Array.isArray(rt.methods) ? rt.methods : [])
    if (rt.hasOwnProperty('methods')) {
      for (const mt in rt.methods) {
        description.methods[mt] = rt.methods[mt]
      }
    }
    if (rt.hasOwnProperty('routes')) {
      router.use(rt.routes);
    } else if ( rt.prototype && rt.prototype.constructor && rt.prototype.constructor.name &&  rt.prototype.constructor.name == 'router') {
      router.use(rt);
    }
  }
  description.routes = {}
  for (const dir of dirs) {
    const subRoute = routesAssembler(express, path.join(baseRoute, dir), notFound)
    router.use(`/${dir}`, subRoute.routes)
    description.routes[dir] = subRoute.description
  }
  router.use('*', notFound)
  if (files.includes('middleware.post.js')) {
    const midlewares = require(path.join(baseRoute, 'middleware.post.js'))
    for (const mw of midlewares) {
      router.use(mw)
    }
  }
  return { routes: router, description };

}

module.exports = {
  /* modules: {
    '/service/tasaFallas/:query': require('./routes/tasaFallas'),
    '/service/estatus/:query': require('./routes/statusRed'),
    '/service/gastos/eq': require('./routes/gastos').router2,
    '/service/gastos/:query': require('./routes/gastos').router,
    '/service/tiemposRespuesta/:query': require('./routes/tiemposRespuesta'),
    '/service/tiempos/:query': require('./routes/tiempos'),
    '/service/presupuestos/:query': require('./routes/presupuestos'),
    '/service/preventivo/:query': require('./routes/preventivo'),
    '/excel': require('./routes/excel'),
    '/health': require('./routes/health'),
    '/filters': require('./routes/filters'),
    '/user': require('./routes/user'),
    '/*': require('./routes/default')
  },
  middlewares: {
    helmet: require('helmet')(),
    jsonBody: require('body-parser').json(),
    urlencoded: require('body-parser').urlencoded(),
    reqId: rfr('/components/req-id/idMiddleware').reqId,
    errorDebug: ['local', 'development'].includes(process.env.NODE_ENV.toLowerCase()) ? require('errorhandler')() : (req, res, next) => next(),
    requesstLogger: ['local', 'development'].includes(process.env.NODE_ENV.toLowerCase()) ? require('morgan')(':date[iso] :method :url :remote-addr :response-time :status :req[Authorization] :req[userId]') : (req, res, next) => next()
  }, */
  setDescriptionExporter,
  initRoutes
}