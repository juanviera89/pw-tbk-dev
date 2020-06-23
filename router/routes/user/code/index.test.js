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

describe('/Code', function () {
    before(function (done) {
        app.waitForAppReady('main', 450).then(ready => {
            if (!ready) {
                throw new Error('App server ready timeout')
            }
            done()
        })
    })
    describe('GET', function () {


        before(async function () {
            const newCode = new code({
                codeId: 'alreadysent',
                validated: false,
                sent: [{ method: 'sms', date: Date.now() }],
                username: 'someuser',
                destination: 'account',
            });
            await newCode.save();
        })
        it('Should return a json object with sent flag and id', function (done) {
            chai.request(app.getApp('main'))
                .get(`/user/code?destination=account&field=email&search=juan_viera22%40hotmail.com`)
                .end((err, res) => {
                    
                    const response = err ? err.response : res;
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.sent.should.be.a('boolean')
                    body.codeId.should.be.a('string')
                    done();
                });
        })
        it('Should return a json object with sent flag and id already sent', function (done) {
            chai.request(app.getApp('main'))
                .get(`/user/code?destination=account&field=email&search=juanviera899%40gmail.com`)
                .end((err, res) => {
                    
                    const response = err ? err.response : res;
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.sent.should.be.a('boolean')
                    body.codeId.should.be.a('string')
                    body.codeId.should.equal('alreadysent')
                    done();
                });
        })
        it('Should return a json object with sent flag and id already sent by asking a new contact method', function (done) {
            chai.request(app.getApp('main'))
                .get(`/user/code?destination=account&field=email&search=juan_viera22%40hotmail.com&change=phone`)
                .end((err, res) => {
                    
                    const response = err ? err.response : res;
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.sent.should.be.a('boolean')
                    body.codeId.should.be.a('string')
                    done();
                });
        })
        it('Should return a 404 status with user not found error code', function (done) {
            chai.request(app.getApp('main'))
                .get(`/user/code?destination=account&field=email&search=juan_viera2020%40hotmail.cl`)
                .end((err, res) => {
                    
                    const response = err ? err.response : res;
                    response.should.have.status(404);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.message.should.be.a('string')
                    body.sent.should.be.a('boolean')
                    done();
                });
        })
        it('Should return a 400 status with method not allowed error code', function (done) {
            chai.request(app.getApp('main'))
                .get(`/user/code?destination=account&field=email&search=juan_viera22%40hotmail.com&change=twitter`)
                .end((err, res) => {
                    
                    const response = err ? err.response : res;
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.message.should.be.a('string')
                    body.sent.should.be.a('boolean')
                    done();
                });
        })
        it('Should return a 400 status with destination not allowed error code', function (done) {
            chai.request(app.getApp('main'))
                .get(`/user/code?destination=oneclick&field=email&search=juan_viera22%40hotmail.com`)
                .end((err, res) => {
                    
                    const response = err ? err.response : res;
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.message.should.be.a('string')
                    body.sent.should.be.a('boolean')
                    done();
                });
        })
        it('Should return a 400 status with user with no phone error code', function (done) {
            chai.request(app.getApp('main'))
                .get(`/user/code?destination=account&field=email&search=juanviera899%40gmail.com&change=phone`)
                .end((err, res) => {
                    
                    const response = err ? err.response : res;
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.message.should.be.a('string')
                    body.sent.should.be.a('boolean')
                    done();
                });
        })

        after(async function () {
            await code.deleteMany({ codeId: 'alreadysent' }).exec();
            await code.deleteMany({ destination: 'account', username: 'someuser' }).exec();
            await code.deleteMany({ destination: 'account', username: 'juan_viera22' }).exec();
            await code.deleteMany({ destination: 'account', username: 'juanviera89' }).exec();
        })
    })
    describe('PUT', function () {

        before(async function () {
            const expired = new Date()
            expired.setFullYear(1990);
            (new code({
                codeId: 'nonvalidated',
                code: 12365,
                validated: false,
                sent: [{ method: 'sms', date: Date.now() }],
                username: 'juanviera89',
                destination: 'account',
            })).save();
            (new code({
                codeId: 'alreadyvalidated',
                code: 12365,
                validated: true,
                sent: [{ method: 'sms', date: Date.now() }],
                username: 'someuser',
                destination: 'account',
            })).save();
            (new code({
                codeId: 'expired',
                code: 12365,
                validated: false,
                sent: [{ method: 'sms', date: expired }],
                username: 'juan_viera22',
                destination: 'account',
            })).save();
        })
        it('Should return a json object validated code flag true', function (done) {
            chai.request(app.getApp('main'))
                .put(`/user/code`).send({
                    codeId: 'nonvalidated',
                    code: '12365',
                    destination: 'account'
                })
                .end((err, res) => {
                    
                    const response = err ? err.response : res;
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.validated.should.be.a('boolean')
                    body.codeId.should.be.a('string')
                    done();
                });
        })
        it('Should return a json object validated code flag false for an already validated code', function (done) {
            chai.request(app.getApp('main'))
                .put(`/user/code`).send({
                    codeId: 'alreadyvalidated',
                    code: '12365',
                    destination: 'account'
                })
                .end((err, res) => {
                    
                    const response = err ? err.response : res;
                    response.should.have.status(404);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.validated.should.be.a('boolean')
                    body.message.should.be.a('string')
                    done();
                });
        })
        it('Should return a json object validated code flag false for an expired code', function (done) {
            chai.request(app.getApp('main'))
                .put(`/user/code`).send({
                    codeId: 'expired',
                    code: '12365',
                    destination: 'account'
                })
                .end((err, res) => {
                    
                    const response = err ? err.response : res;
                    response.should.have.status(404);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.validated.should.be.a('boolean')
                    body.message.should.be.a('string')
                    body.message.should.equal('Code expired')
                    done();
                });
        })
        it('Should return a 404 status code not valid error', function (done) {
            chai.request(app.getApp('main'))
                .put(`/user/code`).send({
                    codeId: 'bad',
                    code: '11111',
                    destination: 'account'
                })
                .end((err, res) => {
                    
                    const response = err ? err.response : res;
                    response.should.have.status(404);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.message.should.be.a('string')
                    body.validated.should.be.a('boolean')
                    done();
                });
        })
        after(async function () {
            await code.deleteMany({ codeId: 'nonvalidated' }).exec();
            await code.deleteMany({ codeId: 'alreadyvalidated' }).exec();
            await code.deleteMany({ codeId: 'expired' }).exec();
        })
    })
})