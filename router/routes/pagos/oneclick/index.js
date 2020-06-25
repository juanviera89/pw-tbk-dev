const express = require("express");
const rfr = require("rfr");
const router = express.Router();
const validate = rfr("/components/validator/middleware").wrapper;
const ocRegister = rfr("/components/tbk").ocRegister;
const ocRegisterConfirmation = rfr("/components/tbk").ocRegisterConfirmation;
const ocAuthorize = rfr("/components/tbk").ocAuthorize;
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

router.get("/init", validate(methods.GET), userInfo, ocRegister);
router.post("/result", validate(methods.GET), ocRegisterConfirmation);
router.post("/finish", validate(methods.GET), ocAuthorize);
module.exports = { methods, routes: router };
