const express = require('express')
const router = express.Router();
//const routerConfig = require('./routesModule.js');
//const cors = require('cors')

/* const init = (routingComponents = routerConfig ) => {
    //router.use(cors())
     router.use(function (req, res, next) {
       
        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin' , '*');
        res.setHeader('Access-Control-Expose-Headers' , '*');
    
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    
        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'username,awskey,userkey,Access-Control-Allow-Origin, Access-Control-Allow-Headers, ' +
                        'Origin, X-Requested-With, Content-Type, CORELATION_ID, content-type, responseType');
        
        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);
    
        // Pass to next layer of middleware
        if ('OPTIONS' == req.method) {
            console.log('OPTIONS', res.getHeaders());
            return res.sendStatus(200);
          }
          else {
            next();
          }
    }); 
    const middlewares = routingComponents.middlewares;
    for (const key in middlewares) {
        router.use(middlewares[key])
    }
    const routes = routingComponents.modules;
    for (const key in routes) {
        router.use(key , (req,res,next) => {
            const newBody = { ...req.params }
            req.body = { ...req.body, reqParams : newBody };
            return next();
        },
         routes[key])
    }
}

const getRouter = () => {
    return router
} */

module.exports = router/*  {
    init,
    getRouter
} */