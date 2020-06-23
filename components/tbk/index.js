const rfr = require("rfr");
const dblog = rfr("db/models/log.js");
const code = rfr("db/models/code.js");
const oneclick = rfr("db/models/oneclick.js");
const cognito = require("../cognito");
const config = require("config");
const errors = require("../../utils/errordictionary.json");
const validator = require("../validator");
const oId = require("mongoose").Types.ObjectId;
const Transbank = require("transbank-sdk");
const wpconfig = new Transbank.c();

const webpay = new Transbank.Webpay(config.get("transbank.webpay.config"));

const initWP = async (buyOrder, sessionId, amount) => {
  const transaction = webpay.getNormalTransaction();
  const returnUrl = config.get("transbank.webpay.returnUrl");
  const finalUrl = config.get("transbank.webpay.finalUrl");
  const tbkResult = await transaction.initTransaction(
    amount,
    buyOrder,
    sessionId,
    returnUrl,
    finalUrl
  );

  console.log(buyOrder, sessionId, returnUrl, finalUrl, amount, tbkResult);
  const body = `<!DOCTYPE html>
  <html>
  <body>
  
  <h2>Iniciando pago</h2>
  
  <form hidden id="tbkform" action="${tbkResult.url}"  method="post">
    <input type="text" id="token_ws" name="token_ws" value="${
      tbkResult.token
    }"><br>
    <input type="submit" value="Submit">
  </form>
  
  </body>
  <script>
  document.getElementById("tbkform").submit();
</script> 
  </html>`;
  return tbkResult;
};

const pagar = (req, res, next) => {
  try {
    const token = initWP(
      `oc${Date.now().toString(24)}`,
      `sid${Date.now().toString(24)}`,
      1500
    );
    const body = `<!DOCTYPE html>
  <html>
  <body>
  
  <h2>Iniciando pago</h2>
  
  <form hidden id="tbkform" action="${token.url}"  method="post">
    <input type="text" id="token_ws" name="token_ws" value="${token.token}"><br>
    <input type="submit" value="Submit">
  </form>
  
  </body>
  <script>
  document.getElementById("tbkform").submit();
</script> 
  </html>`;
    res.status(200).send(body);
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
    next(err);
  }
};

module.exports = {
  initWP,
  pagar
};
