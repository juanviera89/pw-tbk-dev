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


describe('/info', function() {
    before( function(done){
        app.waitForAppReady('main',450).then( ready => {
            if(!ready) {
                throw new Error('App server ready timeout')
            }
            done()
        })
    })
    describe('GET', function(){
        it('Should return a json object with list of users info', function(done) {
            chai.request(app.getApp('main'))
            .get('/user/info?field=email&search=juan_viera22@hotmail.com')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                const body = res.body
                body.found.should.be.an('array').that.is.not.empty
                done();
             });
        })
        it('Should return a 200 status with no users found', function(done) {
            chai.request(app.getApp('main'))
            .get('/user/info?field=email&search=someemail@hotmail.com')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                const body = res.body
                body.found.should.be.an('array').that.is.empty
                done();
             });
        })
        it('Should return a 400 status with missing field error', function(done) {
            chai.request(app.getApp('main'))
            .get('/user/info')
            .end((err, res) => {
                const response = err ? err.response : res;
                response.should.have.status(400);
                response.body.should.be.a('object');
                const body = response.body
                body.message.should.be.a('string')
                //body.code.should.be.a('string') //TODO: Enviar codigo de diccionario de error en body
                done();
             });
        })
    })
})