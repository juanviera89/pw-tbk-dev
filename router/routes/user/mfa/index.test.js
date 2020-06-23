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

const oneclick = rfr('db/models/oneclick.js')

describe('/mfa', function () {
    before(function (done) {
        app.waitForAppReady('main', 450).then(ready => {
            if (!ready) {
                throw new Error('App server ready timeout')
            }
            done()
        })
    })
    describe('POST', function () {
        before(async function () {
            const doc = new oneclick({
                username: 'juanTokenMFA',
                registered: true,
                inscrptionResult: { someprop : 'abcde'}
            })
            await doc.save();
        })
        it('Should return a json object with mfa flag true and updated true  on regular client', function (done) {
            chai.request(app.getApp('main'))
                .post('/user/mfa').set('userkey', 'juanToken').set('devkey', 'kowndevice001').send({
                    mfa: true
                })
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.mfa.should.be.a('boolean')
                    body.updated.should.be.a('boolean')
                    done();
                });
        })
        it('Should return a json object with mfa flag false and updated true  on regular client', function (done) {
            chai.request(app.getApp('main'))
                .post('/user/mfa').set('userkey', 'juanToken').set('devkey', 'kowndevice001').send({
                    mfa: false
                })
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.mfa.should.be.a('boolean')
                    body.updated.should.be.a('boolean')
                    done();
                });
        })
        it('Should return a json object with mfa flag false and updated true on regular client modifying contact method', function (done) {
            chai.request(app.getApp('main'))
                .post('/user/mfa').set('userkey', 'juanToken').set('devkey', 'kowndevice001').send({
                    contact: 'ws'
                })
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.mfa.should.be.a('boolean')
                    body.updated.should.be.a('boolean')
                    done();
                });
        })
        it('Should return a json object with mfa flag true on security client, trying to set false', function (done) {
            chai.request(app.getApp('main'))
                .post('/user/mfa').set('userkey', 'juanTokenMFA').set('devkey', 'kowndevicemfa003').send({
                    mfa: false
                })
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.mfa.should.be.a('boolean')
                    body.updated.should.be.a('boolean')
                    done();
                });
        })
        it('Should return a 403 status with user not authorized error code', function (done) {
            chai.request(app.getApp('main'))
                .post('/user/mfa')/* .set('userkey', 'UserNotAuthenticated2020') TODO: refinar error de usuario*/.send({
                    mfa: true
                })
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
        it('Should return a 400 status with bad contact method error code', function (done) {
            chai.request(app.getApp('main'))
                .post('/user/mfa').set('userkey', 'juanToken').set('devkey', 'kowndevice001').send({
                    contact: 'twitter'
                })
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.message.should.be.a('string')
                    body.updated.should.be.a('boolean')
                    done();
                });
        })
        after( async function(){
            await oneclick.deleteOne({ username : 'juanTokenMFA'}).exec()
        })
    })
})