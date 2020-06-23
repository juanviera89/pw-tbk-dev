const mongoose = require('mongoose');

const oneclick = new mongoose.Schema({
    username : {type : String, required : true},
    createdAt : {type : Date, default : Date.now},
    registered : {type : Boolean, default : false},
    inscrptionResult : mongoose.Schema.Types.Mixed,
})

module.exports = mongoose.model('oneclick', oneclick);