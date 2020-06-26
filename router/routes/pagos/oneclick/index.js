const express = require("express");
const rfr = require("rfr");
const router = express.Router();
const validate = rfr("/components/validator/middleware").wrapper;
const ocRegister = rfr("/components/tbk/controller").ocRegister;
const ocRegisterConfirmation = rfr("/components/tbk/controller").ocRegisterConfirmation;
const ocAuthorize = rfr("/components/tbk/controller").ocAuthorize;
const userInfo = rfr("/components/user/userMiddleware").userInfo;

const methods = {
    register: {
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
                TBK_TOKEN: {
                    type: "string",
                    required: false
                }
            }
        }
    },
    auth: {
        GET: {
            query: {
                oc: {
                    type: "string",
                    required: true
                }
            }
        }
    }
};

router.get("/register", validate(methods.register.GET), userInfo, ocRegister);
router.post("/result", validate(methods.result.POST), ocRegisterConfirmation);
router.post("/auth", validate(methods.auth.GET), ocAuthorize);
module.exports = { methods, routes: router };
