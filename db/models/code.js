const mongoose = require('mongoose');

const code = new mongoose.Schema({
    transactionId: { type: String },
    codeId: { type: String, default: Date.now().toString(16) },
    validated: { type: Boolean, default: false },
    code: { type: Number, default : Number((Math.random()).toString().split('.')[1].substr(0,5)) },
    sent: [{ method : String, date : {type : Date, default: Date.now} }],
    used: { type: Date, default: null },
    username : {type : String},
    destination : {type : String},
    data : mongoose.Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('code', code);