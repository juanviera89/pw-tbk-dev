const rfr = require("rfr");
const dblog = rfr("db/models/log.js");
const code = rfr("db/models/code.js");
const oneclick = rfr("db/models/oneclick.js");
const equipo = rfr('db/models/equipo.js');
const sucursal = rfr('db/models/sucursal.js');
const concesionario = rfr('db/models/concesionario.js');
const pago = rfr('db/models/pago.js');
const descuento = rfr('db/models/descuento.js');
const cognito = require("../cognito");
const config = require("config");
const errors = require("../../utils/errordictionary.json");
const validator = require("../validator");
const oId = require("mongoose").Types.ObjectId;
const Transbank = require("transbank-sdk");

//const webpay = new Transbank.Webpay(config.get("transbank.webpay.config"));
const wpconfig = new Transbank.Configuration();

wpconfig.withCommerceCode(config.get('transbank.webpay.config.commerceCode'))
wpconfig.withPrivateCert(config.get('transbank.webpay.config.privateCert'))
wpconfig.withPublicCert(config.get('transbank.webpay.config.publicCert'))

const occonfig = new Transbank.Configuration();

occonfig.withCommerceCode(config.get('transbank.oneclick.config.commerceCode'))
occonfig.withPrivateCert(config.get('transbank.oneclick.config.privateCert'))
occonfig.withPublicCert(config.get('transbank.oneclick.config.publicCert'))

const wpNormalTransaction = new Transbank.Webpay(
  wpconfig
).getNormalTransaction();
const wpNullifyTransaction = new Transbank.Webpay(
  wpconfig
).getNullifyTransaction();
const oneclickTransaction = new Transbank.Webpay(
  occonfig
).getOneClickTransaction();

const startPayment = async (req, res, next) => {
  try {
    const { equipos, tipo } = req.validInputs.body;
    if (!['webpay', 'oneclick'].includes(tipo)) return res.status(400).send({ message: 'Payment type not supported', oc: null })
    const userAttr = req.userInfo;
    if (tipo == 'oneclick') {
      const userOneclick = await oneclick.findOne({ username: userAttr.username, registered: true }).exec();
      if (!userOneclick) return res.status(400).send({ message: 'Method not available', needRegistration: true, oc: null })
    }
    const eqs = [];
    for (const eq of equipos) {
      const foundEq = await equipo.findOne({ serial: eq });
      if (!foundEq) return res.status(404).send({ message: `Can't process payment. Equipment not found`, oc: null });
      const foundSucursal = await sucursal.findOne({ code: foundEquipo.sucursal }).exec();
      const foundDescuentos = await descuento.find({ sucursales: foundSucursal.code, iDate: { $lt: Date.now() }, eDate: { $gt: Date.now() }, active: true }, { _id: 0 }).exec()
      const descuentoEqs = foundDescuentos.filter(desc => {
        if (!desc.schedule) return true;
        return utils.testDate(desc.schedule)
      }).reduce((descFinal, desc) => {
        if (!descFinal) return desc;
        if (desc.descuento[foundEquipo.type] > descFinal.descuento[foundEquipo.type]) return desc
        return descFinal
      }, null);
      if (!foundSucursal.precio[foundEq.type]) return res.status(500).send({ message: 'error with equipment price', oc: null })
      const pagoEq = {
        serial: foundEq.serial,
        price: foundSucursal.precio[foundEq.type],
        sucursal: foundSucursal.code
      }
      if (descuentoEqs) pagoEq['discount'] = {
        amount: descuentoEqs.descuento[foundEq.type],
        id: descuentoEqs.did
      }
      eqs.push(pagoEq);
    }
    if (!eqs.length) return res.status(400).send({ message: `Can't process payment. No equipments`, oc: null });
    const price = eqs.reduce((amount, eq, i) => amount + eq.price + eq.discount ? eq.discount.amount : 0, 0);
    const oc = `pwoc${Date.now().toString(24)}`
    const sid = `pwsid${Date.now().toString(24)}`
    const doc = {
      oc,
      sessionId: sid,
      username: userAttr.username,
      entorno: process.env.NODE_ENV,
      type: tipo,
      amount: price,
      equipos: eqs
    }
    return res.status(200).send({ oc, tipo })


  } catch (error) {
    const err = {
      errId: 500,
      transactionId: req.transactionId,
      service: 'equipo info',
      type: 'error',
      message: 'Internal server error', // TODO: Use dictionary
      origin: JSON.stringify(error),
    }
    err.error = error
    next(err);
  }

}

const webpayToken = async (buyOrder, sessionId, amount) => {
  const returnUrl = config.get("transbank.webpay.returnUrl");
  const finalUrl = config.get("transbank.webpay.finalUrl");
  const tbkResult = await wpNormalTransaction.initTransaction(
    amount,
    buyOrder,
    sessionId,
    returnUrl,
    finalUrl
  );
  return tbkResult;
};
const webpayResult = async (token) => {
  const tbkResult = await wpNormalTransaction.getTransactionResult(token);
  return tbkResult;
};

const badPaymentInit = `<!DOCTYPE html>
<html>
<body>

<h2>Error iniciando pago</h2>

<div id="action" hidden>error</div>

</body>
</html>`;
const paymentNotFound = `<!DOCTYPE html>
<html>
<body>

<h2>Error de pago. Orden no encontrada</h2>

<div id="action" hidden>error</div>

</body>
</html>`
const paymentInit = `<!DOCTYPE html>
<html>
<body>

<h2>Iniciando pago</h2>

<form hidden id="tbkform" action="#tokenUrl"  method="post">
  <input type="text" id="token_ws" name="token_ws" value="#tokenUrl"><br>
  <input type="submit" value="Submit">
</form>

</body>
<script>
document.getElementById("tbkform").submit();
</script> 
</html>`
const badPaymentProcess = `<!DOCTYPE html>
<html>
<body>

<h2>Error procesando pago</h2>

<div id="action" hidden>error</div>

</body>
</html>`;
const errorPaymentProcess = `<!DOCTYPE html>
<html>
<body>

<h2>Error procesando pago</h2>

<div id="action" hidden>#error</div>

</body>
</html>`;
const finalPayment = `<!DOCTYPE html>
<html>
<body>

<h2>Procesando pago</h2>

<form hidden id="tbkform" action="#redirectUrl"  method="post">
  <input type="text" id="token_ws" name="token_ws" value="#token"><br>
  <input type="submit" value="Submit">
</form>

</body>
<script>
document.getElementById("tbkform").submit();
</script> 
</html>`

const abortPaymentProcess = `<!DOCTYPE html>
<html>
<body>

<h2>Pago abortado</h2>

<div id="action" hidden>Abort</div>

</body>
</html>`;
const paymentProcessDone = `<!DOCTYPE html>
<html>
<body>

<h2>Pago completado</h2>
<p>Sus equipos serán habilitados en breve</p>

<div id="action" hidden>done</div>

</body>
</html>`;

const oneclickRegisterInit = `<!DOCTYPE html>
<html>
<body>

<h2>Procesando pago</h2>

<form hidden id="tbkform" action="#redirectUrl"  method="post">
  <input type="text" id="token_ws" name="TBK_TOKEN" value="#token"><br>
  <input type="submit" value="Submit">
</form>

</body>
<script>
document.getElementById("tbkform").submit();
</script> 
</html>`


const fatalError = `<!DOCTYPE html>
<html>
<body>
<h1>Error en transaccion</h1>
<h3>No pudimos procesar la transaccion, le pedimos disculpas por los inconvenientes </h3>

<div id="action" hidden>fatal</div>

</body>
</html>`
const oneclickSuccess = `<!DOCTYPE html>
<html>
<body>
<h1>Usuario registrado</h1>

<div id="action" hidden>success</div>

</body>
</html>`
const oneclickDuplicated = `<!DOCTYPE html>
<html>
<body>
<h1>Usuario ya esta registrado</h1>

<div id="action" hidden>duplicated</div>

</body>
</html>`
const oneclickFailed = `<!DOCTYPE html>
<html>
<body>
<h1>Error en transaccion</h1>
<h3>No pudimos procesar la transaccion, le pedimos disculpas por los inconvenientes </h3>

<div id="action" hidden>error</div>

</body>
</html>`

const initWP = async (req, res, next) => {
  try {
    const { oc } = req.validInputs.body;
    const userAttr = req.userInfo;
    const buyOrder = await pago.findOne({ oc, username: userAttr.username }).exec()
    if (!buyOrder) return res.status(404).send(paymentNotFound)
    if (buyOrder.tbk && buyOrder.tbk.init) return res.status(400).send(badPaymentInit);
    const token = await webpayToken(buyOrder.oc, buyOrder.sessionId, buyOrder.amount);
    await pago.updateOne({ oc, username: userAttr.username }, { $set: { "tbk.init": token } }).exec();
    const body = paymentInit.replace('#tokenUrl', token.url).replace('#tokenUrl', token.token);
    return res.status(200).send(body);
  } catch (error) {
    const err = {
      errId: 500,
      transactionId: req.transactionId,
      service: "modifyInfo",
      type: "error",
      message: "Internal server error", // TODO: Use dictionary
      origin: JSON.stringify(error)
    };
    err.error = error;
    //TODO LOG ERROR
    return res.status(500).send(fatalError);
    //next(err);
  }
};


const resultWP = async (req, res, next) => {
  try {
    //const userAttr = req.userInfo;
    const token = req.body.token_ws;
    const buyOrder = await pago.findOne({ "tbk.init.token" : token }).exec()
    const response = await webpayResult(token);
    const oc = response.buyOrder;
    const sid = response.sessionId;
    if (!oc || !sid) {
      res.status(500).send(badPaymentProcess);
      await pago.updateOne({ "tbk.init.token" : token }, { $set: { "tbk.result": response, "tbk.error": true, "tbk.exito": false } }).exec()
      return
    }
    const output = response.detailOutput[0];
    //const buyOrder = await pago.findOne({ oc, username: userAttr.username }).exec()
    if (!buyOrder) { //Como no se pudo registrar el pago para usarse en activaciones, se devuelve el dinero al cliente
      const nulled = await wpNullifyTransaction.nullify(output.authorizationCode, output.amount, response.buyOrder, output.amount);
      //TODO log nullify action
      return res.status(404).send(paymentNotFound)
    }
    if (output.responseCode != 0) {
      // TODO: usar diccionario en front para mostrar error https://www.transbankdevelopers.cl/referencia/webpay?l=java#confirmar-una-transaccion-webpay-plus-normal
      const body = errorPaymentProcess.replace('#error', `${response.VCI}#${output.responseCode}`)
      res.status(400).send(body);
      await pago.updateOne({ oc, username: buyOrder.username }, { $set: { "tbk.result": response, "tbk.exito": false } }).exec()
      //Log error
      return
    }
    //TODO: log user payment
    await pago.updateOne({ oc, username: buyOrder.username }, { $set: { "tbk.result": response, "tbk.exito": true, "tbk.token": token } })
    const body = finalPayment.replace('#redirectUrl', response.urlRedirection).replace('#token', token);
    return res.status(200).send(body);
  } catch (error) {
    const err = {
      errId: 500,
      transactionId: req.transactionId,
      service: "modifyInfo",
      type: "error",
      message: "Internal server error", // TODO: Use dictionary
      origin: JSON.stringify(error)
    };
    err.error = error;
    //TODO LOG ERROR
    return res.status(500).send(fatalError);
    //next(err);
  }
};

const finishtWP = async (req, res, next) => {
  try {
    const token = req.body.token_ws;
    if (typeof req.body.TBK_TOKEN !== "undefined" || !token) {
      //TODO log abortion action
      return res.status(400).send(abortPaymentProcess)
    }
    const buyOrder = await pago.findOne({ "tbk.token": token, "tbk.exito": true }).exec();
    if (!buyOrder) {
      //TODO log payment finished on no token register found
      return res.status(400).send(abortPaymentProcess) //Migth be still able to activate eqs
    }
    //TODO Call activation process for eqs in buyOrder
    return res.status(200).send(paymentProcessDone);
  } catch (error) {
    const err = {
      errId: 500,
      transactionId: req.transactionId,
      service: "modifyInfo",
      type: "error",
      message: "Internal server error", // TODO: Use dictionary
      origin: JSON.stringify(error)
    };
    err.error = error;
    //TODO LOG ERROR
    return res.status(500).send(fatalError);
    //next(err);
  }
};

const ocRegister = async (req, res, next) => {
  try {
    const userAttr = req.userInfo;
    const ocregistration = await oneclick.findOne({username: userAttr.username,registered:true});
    if(ocregistration) {
      //TODO: log duplicaed oneclick registration intent
      return res.status(200).send(oneclickDuplicated);
    }
    const token = await oneclickTransaction.initInscription(userAttr.username, userAttr.email, config.get('transbank.oneclick.config.final'))
    const oc = new oneclick({
      username: userAttr.username,
      token : token.token
    })
    await oc.save();
    const body = oneclickRegisterInit.replace('#redirectUrl', token.urlWebpay).replace('#token', token.token);
    return res.status(200).send(body)
  } catch (error) {
    const err = {
      errId: 500,
      transactionId: req.transactionId,
      service: "modifyInfo",
      type: "error",
      message: "Internal server error", // TODO: Use dictionary
      origin: JSON.stringify(error)
    };
    err.error = error;
    //TODO LOG ERROR
    return res.status(500).send(fatalError);
    //next(err);
  }
};



const ocRegisterConfirmation = async (req, res, next) => {
  try {
    const token = req.body.TBK_TOKEN;
    const response = oneclickTransaction.finishInscription(token); //TODO Debug response, properties must be in root
    if (response.responseCode != 0) {
      //TODO log process failure
      res.status(400).send(oneclickFailed)

      await oneclick.updateOne({ token }, { $set: { registered: false, inscrptionResult: response } }).exec();
      return
    }
    const ocReg = await oneclick.findOne({token});
    if(!ocReg){
      //TODO LOG registration completion on invalid user registration
    return res.status(200).send(oneclickFailed)
    }
    await oneclick.updateOne({ token }, { $set: { registered: true, inscrptionResult: response } }).exec();
    res.status(200).send(oneclickSuccess)
  } catch (error) {
    const err = {
      errId: 500,
      transactionId: req.transactionId,
      service: "modifyInfo",
      type: "error",
      message: "Internal server error", // TODO: Use dictionary
      origin: JSON.stringify(error)
    };
    err.error = error;
    //TODO LOG ERROR
    return res.status(500).send(fatalError);
    //next(err);
  }
};

module.exports = {
  initWP,
  pagar,
  startPayment,
  resultWP,
  finishtWP
};
