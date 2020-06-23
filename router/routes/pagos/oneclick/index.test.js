// Import the dependencies for testing
/* import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index.js'; */
const chai = require('chai')
const chaiHttp = require('chai-http')
const rfr = require('rfr')
const app = rfr('/index.js')
// Configure chai
chai.use(chaiHttp);
chai.should();


describe.skip('/oneclick', function() {
    before( function(done){
        app.waitForAppReady('main',450).then( ready => {
            if(!ready) {
                throw new Error('App server ready timeout')
            }
            done()
        })
    })
    describe('GET', function(){
        it('Should return a json object with payment status ok and activation list ok ', function(done) {
            chai.request(app.getApp('main'))
            .get('/pagos/oneclick')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                bodyy = res.body;
                body.payment.should.be.a('boolean')
                body.list.should.be.an( 'array')
                done();
             });
        })
        it('Should return a json object with payment status failure ', function(done) {
            chai.request(app.getApp('main'))
            .get('/pagos/oneclick')
            .end((err, res) => {
                res.should.have.status(500);
                res.body.should.be.a('object');
                bodyy = res.body;
                body.payment.should.be.a('boolean')
                body.list.should.be.an( 'array')
                done();
             });
        })
        it('Should return a json object with payment status ok and activation list not ok ', function(done) {
            chai.request(app.getApp('main'))
            .get('/pagos/oneclick')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                bodyy = res.body;
                body.payment.should.be.a('boolean')
                body.list.should.be.an( 'array')
                done();
             });
        })
        it('Should return a 404 status with equipments not found error code', function(done) {
            chai.request(app.getApp('main'))
            .get('/pagos/oneclick')
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                const body = res.body
                body.message.should.be.a('string')
                body.code.should.be.a('string')
                done();
             });
        })
        it('Should return a 500 status with equipments offline error code', function(done) {
            chai.request(app.getApp('main'))
            .get('/pagos/oneclick')
            .end((err, res) => {
                res.should.have.status(500);
                res.body.should.be.a('object');
                const body = res.body
                body.message.should.be.a('string')
                body.code.should.be.a('string')
                done();
             });
        })
    })
    describe('POST', function(){
        it('Should return a html form with tbk error for onclick param registered', function(done) {
            chai.request(app.getApp('main'))
            .get('/pagos/oneclick')
            .end((err, res) => {
                res.should.have.status(500);
                res.should.have.header('content-type', 'text/html');
                done();
             });
        })
        it('Should return a html form with error for onclick param register with user not found', function(done) {
            chai.request(app.getApp('main'))
            .get('/pagos/oneclick')
            .end((err, res) => {
                res.should.have.status(404);
                res.should.have.header('content-type', 'text/html');
                done();
             });
        })
        it('Should return a html form with error for onclick param register', function(done) {
            chai.request(app.getApp('main'))
            .get('/pagos/oneclick')
            .end((err, res) => {
                res.should.have.status(500);
                res.should.have.header('content-type', 'text/html');
                done();
             });
        })
    })
    describe('DELETE', function(){
        it('Should return a json object with registered flag true', function(done) {
            chai.request(app.getApp('main'))
            .get('/pagos/oneclick')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.have.header('content-type', 'text/html');
                const body = res.body
                body.registered.should.be.a('boolean')
                done();
             });
        })
        it('Should return a error with user not found error code', function(done) {
            chai.request(app.getApp('main'))
            .get('/pagos/oneclick')
            .end((err, res) => {
                res.should.have.status(404);
                res.should.have.header('content-type', 'text/html');
                const body = res.body
                body.registered.should.be.a('boolean')
                done();
             });
        })
        it('Should return a error with tbk error code', function(done) {
            chai.request(app.getApp('main'))
            .get('/pagos/oneclick')
            .end((err, res) => {
                res.should.have.status(500);
                res.should.have.header('content-type', 'text/html');
                const body = res.body
                body.registered.should.be.a('boolean')
                done();
             });
        })
    })
})