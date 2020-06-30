const express = require("express");
const rfr = require("rfr");
const router = express.Router();
const validate = rfr("/components/validator/middleware").wrapper;
const ocRegister = rfr("/components/tbk/controller").ocRegister;
const ocRegisterConfirmation = rfr("/components/tbk/controller").ocRegisterConfirmation;
const ocAuthorize = rfr("/components/tbk/controller").ocAuthorize;
const ocUnregister = rfr("/components/tbk/controller").ocUnregister;
const ocList = rfr("/components/tbk/controller").ocList;
const userInfo = rfr("/components/user/userMiddleware").userInfo;

const methods = {
    register: {
        GET: {
            query: {
                oc: {
                    type: "string",
                    required: false
                }
            }
        }
    },
    unregister: {
        GET: {
            query: {
                tk: {
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
    },
    GET: {
    }
};

router.get("/register", validate(methods.register.GET), userInfo, ocRegister);
router.get("/unregister", validate(methods.register.GET), userInfo, ocUnregister);
router.post("/result", validate(methods.result.POST), ocRegisterConfirmation);
router.get("/auth", validate(methods.auth.GET),userInfo, ocAuthorize);
router.get("/",userInfo, ocList);
module.exports = { methods, routes: router };
