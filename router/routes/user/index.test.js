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


describe('/User', function () {
    before(function (done) {
        app.waitForAppReady('main', 450).then(ready => {
            if (!ready) {
                throw new Error('App server ready timeout')
            }
            done()
        })
    })
    describe('GET', function () {
        it('Should return a json object user info for a user fron unknown device with no mfa needed', function (done) {
            chai.request(app.getApp('main'))
                .get('/user').set('userkey', 'juanToken').set('devkey', 'unnkowndevice001')
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.email.should.be.a('string')
                    done();
                });
        })
        it('Should return a json object user info for a user fron known device with mfa succeded', function (done) {
            chai.request(app.getApp('main'))
                .get('/user').set('userkey', 'juanTokenMFA').set('devkey', 'kowndevicemfa003')
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.email.should.be.a('string')
                    done();
                });
        })
        it('Should return a json object user info for a user fron unknown device with no mfa required', function (done) {
            chai.request(app.getApp('main'))
                .get('/user').set('userkey', 'juanToken').set('devkey', 'unnkowndevice001')
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.email.should.be.a('string')
                    done();
                });
        })
        it('Should return a json object code required for an unknown device with mfa required', function (done) {
            chai.request(app.getApp('main'))
                .get('/user').set('userkey', 'juanTokenMFA').set('devkey', 'unnkowndevicemfa002')
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(403);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.message.should.be.a('string')
                    body.requireMFA.should.be.a('boolean')
                    done();
                });
        })
        it('Should return a 403 status with user not found error code', function (done) {
            chai.request(app.getApp('main'))
                .get('/user')
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(403);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.message.should.be.a('string')
                    body.code.should.be.a('string')
                    done();
                });
        })
    })
    describe('PUT', function () {
        it('Should return a json object recently registered user info', function (done) {
            chai.request(app.getApp('main'))
                .put('/user').send({
                    'phone': `+56949085251`,
                    'name': 'Juan',
                    'lastname': 'Viera',
                    'email': `juan_viera2222@hotmail.com`,
                    'dni': `26115814-0`,
                    password : 'MyNewPassword2021'
                })
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.user.should.be.an('object')
                    done();
                });
        })
        it('Should return a 409 status with user already exist error code', function (done) {
            chai.request(app.getApp('main'))
                .put('/user').send({
                    'phone': `+56949085251`,
                    'name': 'Juan',
                    'lastname': 'Viera',
                    'email': `juan_viera22@hotmail.com`,
                    'dni': `26115814-0`,
                    password : 'MyNewPassword2021'
            })
            .end((err, res) => {
                const response = err ? err.response : res;
                response.should.have.status(409);
                response.body.should.be.a('object');
                const body = response.body
                body.message.should.be.a('string')
                body.code.should.be.a('string')
                done();
            });
    })
})
describe('POST', function () {
    it('Should return a json object recently updated user info', function (done) {
        chai.request(app.getApp('main'))
            .post('/user').set('userkey', 'juanToken').set('devkey', 'kowndevice001').send({
                dni: '19792739'
            })
            .end((err, res) => {
                const response = err ? err.response : res;
                response.should.have.status(200);
                response.body.should.be.a('object');
                const body = response.body
                body.user.should.be.an('object')
                done();
            });
    })
    it('Should return a 403 status with user not found error code', function (done) {
        chai.request(app.getApp('main'))
            .post('/user')
            .end((err, res) => {
                const response = err ? err.response : res;
                response.should.have.status(403);
                response.body.should.be.a('object');
                const body = response.body
                body.message.should.be.a('string')
                body.code.should.be.a('string')
                done();
            });
    })
})
})