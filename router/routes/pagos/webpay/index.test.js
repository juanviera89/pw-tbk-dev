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


describe.skip('/webpay', function() {
    before( function(done){
        app.waitForAppReady('main',450).then( ready => {
            if(!ready) {
                throw new Error('App server ready timeout')
            }
            done()
        })
    })
    describe('GET', function(){
        it('Should return a html form ', function(done) {
            chai.request(app.getApp('main'))
            .get('/pagos/webpay')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.have.header('content-type', 'text/html');
                done();
             });
        })
        it('Should return a 404 status with equipments not found error code', function(done) {
            chai.request(app.getApp('main'))
            .get('/pagos/webpay')
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
            .get('/pagos/webpay')
            .end((err, res) => {
                res.should.have.status(204);
                res.body.should.be.a('object');
                const body = res.body
                body.message.should.be.a('string')
                body.code.should.be.a('string')
                done();
             });
        })
    })
    describe('POST', function(){
        it('Should return a html form with tbk error for tbk param result', function(done) {
            chai.request(app.getApp('main'))
            .get('/pagos/webpay')
            .end((err, res) => {
                res.should.have.status(500);
                res.should.have.header('content-type', 'text/html');
                done();
             });
        })
        it('Should return a html form with tbk error for tbk param final', function(done) {
            chai.request(app.getApp('main'))
            .get('/pagos/webpay')
            .end((err, res) => {
                res.should.have.status(500);
                res.should.have.header('content-type', 'text/html');
                done();
             });
        })
    })
})