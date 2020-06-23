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

const code = rfr('db/models/code.js');

describe('/pwd', function () {
    before(function (done) {
        app.waitForAppReady('main', 450).then(ready => {
            if (!ready) {
                throw new Error('App server ready timeout')
            }
            done()
        })
    })
    describe('POST', function () {
        const codeId = `test${Date.now().toString(16)}`;
        const codeIdUsed = `test${Date.now().toString(16)}used`;
        before(async function () {
            const newCode = new code({
                codeId: codeId,
                validated: true,
                sent: [{ method: 'sms' }],
                username: 'juan_viera22',
                destination: 'password',
            });
            await newCode.save();
            const usedCode = new code({
                codeId: codeIdUsed,
                validated: true,
                sent: [{ method: 'sms' }],
                username: 'juan_viera22',
                destination: 'password',
                used: Date.now()
            });
            await usedCode.save()
        })
        it('Should return a json object with update flag true', function (done) {
            chai.request(app.getApp('main'))
                .post(`/user/pwd`).send({
                    password:'Newpass2020',
                    codeId:codeId
                })
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    const body = res.body
                    body.updated.should.be.a('boolean')
                    done();
                });
        })
        it('Should return a json object with update flag false for code already used', function (done) {
            chai.request(app.getApp('main'))
                .post(`/user/pwd`).send({
                    password:'Newpass2020',
                    codeId:codeIdUsed
                })
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(409);
                    response.body.should.be.a('object');
                    const body = res.body
                    body.updated.should.be.a('boolean')
                    body.message.should.be.a('string')
                    done();
                });
        })
        after(async function () {
            await code.deleteOne({codeId : codeId}).exec();
            await code.deleteOne({codeId : codeIdUsed}).exec();
        })
    })

    describe('PUT', function(){
        const codeId = `test${Date.now().toString(16)}`;
        const codeIdUsed = `test${Date.now().toString(16)}used`;
        before(async function () {
            const newCode = new code({
                codeId: codeId,
                validated: true,
                sent: [{ method: 'sms' }],
                username: 'juan_viera22',
                destination: 'password',
            });
            await newCode.save();
            const usedCode = new code({
                codeId: codeIdUsed,
                validated: true,
                sent: [{ method: 'sms' }],
                username: 'juan_viera22',
                destination: 'password',
                used: Date.now()
            });
            await usedCode.save()
        })
        it('Should return a json object with update flag true for user logged with no mfa requirement', function (done) {
            chai.request(app.getApp('main'))
                .put('/user/pwd').set('userkey', 'juanToken').set('devkey', 'kowndevice001').send({
                    password:'Newpass2020'
                })
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    const body = res.body
                    body.updated.should.be.a('boolean')
                    done();
                });
        })
        it('Should return a 403 status with user not allowed for a user logged with mfa requirement', function (done) {
            chai.request(app.getApp('main'))
                .put('/user/pwd').set('userkey', 'juanTokenMFA').set('devkey', 'kowndevicemfa003').send({
                    password:'Newpass2020'
                })
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(403);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.updated.should.be.a('boolean')
                    body.message.should.be.a('string')
                    done();
                });
        })
        it('Should return a json object with update flag false for bad password pattern', function (done) {
            chai.request(app.getApp('main'))
                .put('/user/pwd').set('userkey', 'juanToken').set('devkey', 'kowndevice001').send({
                    password:'badPassword'
                })
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    const body = res.body
                    body.updated.should.be.a('boolean')
                    body.message.should.be.a('string')
                    done();
                });
        })
        
        after(async function () {
            await code.deleteOne({codeId : codeId}).exec();
            await code.deleteOne({codeId : codeIdUsed}).exec();
        })
    })
})