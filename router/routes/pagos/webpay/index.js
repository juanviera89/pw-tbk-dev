const express = require("express");
const rfr = require("rfr");
const router = express.Router();
const validate = rfr("/components/validator/middleware").wrapper;
const initWP = rfr("/components/tbk").initWP;
const resultWP = rfr("/components/tbk").resultWP;
const finishtWP = rfr("/components/tbk").finishtWP;
const userInfo = rfr("/components/user/userMiddleware").userInfo;

const methods = {
  init: {
    GET: {
      query: {
        oc: {
          type: "string",
          required: true
        }
      }
    }
  },
  result: {
    POST: {
      body: {
        token_ws: {
          type: "string",
          required: false
        }
      }
    }
  },
  finish: {
    POST: {
      body: {
        token_ws: {
          type: "string",
          required: false
        },
        TBK_TOKEN: {
          type: "string",
          required: false
        }
      }
    }
  }
};

router.get("/init", validate(methods.init.GET),userInfo, initWP);
router.post("/result", validate(methods.result.POST), resultWP);
router.post("/finish", validate(methods.finish.POST), finishtWP);
module.exports = { methods, routes: router };
