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
const { activateList, activationProcess } = require('../equipo/controller');

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
<div id="message" hidden>#message</div>

</body>
</html>`;
const paymentNotFound = `<!DOCTYPE html>
<html>
<body>

<h2>Error de pago. Orden no encontrada</h2>

<div id="action" hidden>error</div>
<div id="message" hidden>#message</div>

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
<div id="message" hidden>#message</div>

</body>
</html>`;
const errorPaymentProcess = `<!DOCTYPE html>
<html>
<body>

<h2>Error procesando pago</h2>

<div id="action" hidden>#error</div>
<div id="message" hidden>#message</div>

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
<div id="message" hidden>#message</div>

</body>
</html>`;
const paymentProcessDone = `<!DOCTYPE html>
<html>
<body>

<h2>Pago completado</h2>
<p>Sus equipos serán habilitados en breve</p>

<div id="action" hidden>success</div>
<div id="message" hidden>#message</div>

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
</html>`;
const fatalError = `<!DOCTYPE html>
<html>
<body>
<h1>Error en transaccion</h1>
<h3>No pudimos procesar la transaccion, le pedimos disculpas por los inconvenientes </h3>

<div id="action" hidden>fatal</div>
<div id="message" hidden>#message</div>

</body>
</html>`
const oneclickSuccess = `<!DOCTYPE html>
<html>
<body>
<h1>Usuario registrado</h1>

<div id="action" hidden>success</div>
<div id="message" hidden>#message</div>

</body>
</html>`
const oneclickDuplicated = `<!DOCTYPE html>
<html>
<body>
<h1>Usuario ya esta registrado</h1>

<div id="action" hidden>duplicated</div>
<div id="message" hidden>#message</div>

</body>
</html>`
const oneclickFailed = `<!DOCTYPE html>
<html>
<body>
<h1>Error en transaccion</h1>
<h3>No pudimos procesar la transaccion, le pedimos disculpas por los inconvenientes </h3>

<div id="action" hidden>error</div>
<div id="message" hidden>#message</div>

</body>
</html>`
const oneclickAuthorized = `<!DOCTYPE html>
<html>
<body>
<h1>Pago autorizado</h1>

<div id="action" hidden>success</div>
<div id="message" hidden>#message</div>

</body>
</html>`
const oneclickError = `<!DOCTYPE html>
<html>
<body>
<h1>Error en transaccion</h1>
<h3>No pudimos procesar la transaccion, le pedimos disculpas por los inconvenientes </h3>

<div id="action" hidden>#error</div>
<div id="message" hidden>#message</div>

</body>
</html>`



const initWP = async (req, res, next) => { //Inicia pago WebPay
  try {
    const { oc } = req.validInputs.query;
    const userAttr = req.userInfo;
    const buyOrder = await pago.findOne({ oc, username: userAttr.username, type: 'webpay' }).exec()
    if (!buyOrder) return res.status(404).send(paymentNotFound.replace('#message', 'No existe pago asociado'))
    if (buyOrder.tbk && buyOrder.tbk.init) return res.status(400).send(badPaymentInit.replace('#message', 'No existe pago asociado'));
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
    res.status(500).send(fatalError.replace('#message', 'Ocurrió un error inesperado'));
    await logerror(err)
    return
    //next(err);
  }
};


const resultWP = async (req, res, next) => { //Resuelve pago webpay
  try {
    //const userAttr = req.userInfo;
    const token = req.body.token_ws;
    const buyOrder = await pago.findOne({ "tbk.init.token": token }).exec()

    console.log('=================resultWP===================');
    console.log(token, req.body.TBK_TOKEN);
    console.log('====================================');
    const response = await webpayResult(token);
    const oc = response.buyOrder;
    const sid = response.sessionId;
    if (!oc || !sid) {
      res.status(500).send(badPaymentProcess.replace('#message', 'Ocurrio un error en la transacción'));
      await pago.updateOne({ "tbk.init.token": token }, { $set: { "tbk.result": response, "tbk.error": true, "tbk.exito": false } }).exec()
      return
    }
    const output = response.detailOutput[0];
    //const buyOrder = await pago.findOne({ oc, username: userAttr.username }).exec()
    if (!buyOrder) { //Como no se pudo registrar el pago para usarse en activaciones, se devuelve el dinero al cliente
      const nulled = await wpNullifyTransaction.nullify(output.authorizationCode, output.amount, response.buyOrder, output.amount);
      //TODO log nullify action
      return res.status(404).send(paymentNotFound.replace('#message', 'Pago no asociado a orden de compra, el monto será devuelto en breve'))
    }
    if (output.responseCode != 0) {
      // TODO: usar diccionario en front para mostrar error https://www.transbankdevelopers.cl/referencia/webpay?l=java#confirmar-una-transaccion-webpay-plus-normal
      const body = errorPaymentProcess.replace('#error', `${response.VCI}#${output.responseCode}`).replace('#message', 'Error en la transaccion')
      res.status(400).send(body);
      await pago.updateOne({ oc, username: buyOrder.username }, { $set: { "tbk.result": response, "tbk.exito": false } }).exec()
      //Log error
      return
    }
    //TODO: log user payment
    try {
      activateList(buyOrder.equipos.map(eq => eq.serial), buyOrder.username);
    } catch (error) {
      //TODO: log activation error
    }
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
    res.status(500).send(fatalError.replace('#message', 'Ocurrió un error inesperado'));
    await logerror(err)
    return
    //next(err);
  }
};

const finishtWP = async (req, res, next) => { //finaliza pago webpay
  try {
    const token = req.body.token_ws;
    console.log('=================finishtWP===================');
    console.log(token, req.body.TBK_TOKEN);
    console.log('====================================');
    if (typeof req.body.TBK_TOKEN !== "undefined" || !token) {
      //TODO log abortion action
      res.status(400).send(abortPaymentProcess.replace('#message', 'Ha abortado la operación, deberá iniciar de nuevo para habilitar los equipos'))

      await pago.updateOne({ "tbk.init.token": req.body.TBK_TOKEN }, { $set: { "tbk.finish": { token : req.body.TBK_TOKEN, failed : true } } })
      return
    }
    const buyOrder = await pago.findOne({ "tbk.init.token": token, "tbk.exito": true }).exec();
    if (!buyOrder) {
      //TODO log payment finished on no token register found
      return res.status(400).send(abortPaymentProcess.replace('#message', 'Error con la transacción. Por favor revise su historial de pagos para validar que fue efectuado. Si existe algun problema con su pago, contacte al servicio de soporte')) //Migth be still able to activate eqs
      //TODO: en front, al terminar, solicitar activacion en caso de error, de manera que el usuario no este obligado a solicitar la activacion a menos q efectivamente el equipo no haya sido activado
    }
    await pago.updateOne({ "tbk.init.token": token }, { $set: { "tbk.finish": { token } } }) 
    return res.status(200).send(paymentProcessDone.replace('#message', 'Pago realizado con éxito, el o los equipos se habilitarán en breve'));
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
    res.status(500).send(fatalError.replace('#message', 'Ocurrió un error inesperado'));
    await logerror(err)
    return
    //next(err);
  }
};

const ocRegister = async (req, res, next) => { // Inicia registro oneClick
  try {
    const userAttr = req.userInfo;
    const ocregistration = await oneclick.findOne({ username: userAttr.username, registered: true });
    if (ocregistration) {
      //TODO: log duplicaed oneclick registration intent
      return res.status(200).send(oneclickDuplicated.replace('#message', 'Usted ya posee tarjeta registrada en OneClick'));
    }
    const token = await oneclickTransaction.initInscription(userAttr.username, userAttr.email, config.get('transbank.oneclick.config.final'))
    const oc = new oneclick({
      username: userAttr.username,
      token: token.token
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
    res.status(500).send(fatalError.replace('#message', 'Ocurrió un error inesperado'));
    await logerror(err)
    return
    //next(err);
  }
};



const ocRegisterConfirmation = async (req, res, next) => { //Resuelve registro oneclick
  try {
    const token = req.body.TBK_TOKEN;
    const response = await oneclickTransaction.finishInscription(token); //TODO Debug response, properties must be in root
    console.log('===================ocRegisterConfirmation=================');
    console.log(response);
    console.log('====================================');
    if (response.responseCode != 0) {
      //TODO log process failure
      res.status(400).send(oneclickFailed.replace('#message', 'Ha fallado la inscripción en Oneclick'))

      await oneclick.updateOne({ token }, { $set: { registered: false, inscrptionResult: response } }).exec();
      return
    }
    const ocReg = await oneclick.findOne({ token });
    if (!ocReg) {
      //TODO LOG registration completion on invalid user registration
      return res.status(500).send(oneclickFailed.replace('#message', 'No existe transacción asociada en nuestros registros OneClick'))
    }
    await oneclick.updateOne({ token }, { $set: { registered: true, inscrptionResult: response } }).exec();
    return res.status(200).send(oneclickSuccess.replace('#message', 'Usuario registrado con exito'))
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
    res.status(500).send(fatalError.replace('#message', 'Ocurrió un error inesperado'));
    await logerror(err)
    return
    //next(err);
  }
};

//TODO Oneclick unregister

const ocAuthorize = async (req, res, next) => { // Realiza pago OneClick
  try {
    const { oc } = req.validInputs.query;
    const userAttr = req.userInfo;
    const buyOrder = await pago.findOne({ oc, username: userAttr.username, type: 'oneclick' }).exec()
    if (!buyOrder) return res.status(404).send(oneclickError.replace('#error', 'error').replace('#message', 'No se pudo procesar la compra'))//{ paid: false, message: 'Buy order not found' })
    if (buyOrder.tbk && buyOrder.tbk.init) return res.status(400).send(oneclickError.replace('#error', 'error').replace('#message', 'No se puede procesar la compra'))//{ paid: false, message: 'Unable to process buy order' });
    const userOneclick = await oneclick.findOne({ username: userAttr.username, registered: true }).exec();
    if (!userOneclick) return res.status(400).send(oneclickError.replace('#error', 'error').replace('#message', 'Usuario sin registros en OneClick'))//{ paid: false, message: 'User not authorized', needRegistration: true })
    if ((userOneclick.inscrptionResult && (!userOneclick.inscrptionResult.tbkUser)) || !userOneclick.inscrptionResult) {
      await pago.updateOne({ '_id': oId(userOneclick) }, { $set: { registered: false } }).exec()
      return res.status(500).send(oneclickError.replace('#error', 'error').replace('#message', 'Error en el registro de oneclick, no se puede autorizar la compra'))//{ paid: false, message: 'Error on Oneclick registration' })
    }
    const response = await oneclickTransaction.authorize(buyOrder, userOneclick.inscrptionResult.tbkUser, userAttr.username, buyOrder.amount); //TODO Debug response, properties must be in root
    if (response.responseCode != 0) {
      //TODO log process failure
      res.status(400).send(oneclickError.replace('#error', response.responseCode).replace('#message', 'Ha ocurrido un error'))//{ paid: false, message: 'Error on Oneclick registration', responseCode: response.responseCode })
      //TODO usar diccionario en front para emitir error a usuario https://www.transbankdevelopers.cl/referencia/webpay#autorizar-un-pago-con-oneclick
      await pago.updateOne({ oc, username: buyOrder.username }, { $set: { "tbk.result": response, "tbk.exito": false } }).exec()
      return
    }
    await pago.updateOne({ oc, username: buyOrder.username }, { $set: { "tbk.result": response, "tbk.exito": false } }).exec()

    try {
      await activateList(buyOrder.equipos.map(eq => eq.serial), buyOrder.username);
    } catch (error) {
      //TODO: log activation error
    }
    return res.status(200).send(oneclickAuthorized.replace('#message', 'Pago autorizado. El o los equipos serán habilidatos en breve'))//{ paid: true })
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
    res.status(500).send(fatalError.replace('#message', 'Ocurrió un error inesperado'));
    await logerror(err)
    return
    //next(err);
  }
};

const logerror = async errObj => {
  const err = {
    transactionId: errObj.transactionId,
    service: errObj.service,
    type: "error",
    message: errObj.message,
    comment:
      (errObj.error && errObj.error.message ? errObj.error.message : "") +
      "#" +
      JSON.stringify(
        errObj.error && errObj.error.stack ? errObj.error.stack : ""
      ),
    origin: errObj.origin
  };
  console.log(err);

  const log = new dblog(err);
  await log.save();
};

module.exports = {
  initWP,
  resultWP,
  finishtWP,
  ocRegister,
  ocRegisterConfirmation,
  ocAuthorize
};
