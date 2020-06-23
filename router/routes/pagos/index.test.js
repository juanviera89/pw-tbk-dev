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

const pago = rfr('db/models/pago.js');

describe('/pagos', function () {
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
            (new pago({
                oc: 'webpayactivado',
                username: 'juan_viera22',
                type: 'webpay',
                amount: 1400,
                equipos: [{
                    serial: 'String',
                    price: 1500,
                    activated: true,
                    date: Date.now()
                }],
                tbk: {
                    tipo: 'dc',
                    exito: true,
                    date: Date.now()
                },
                createdAt: Date.now()
            })).save();
            (new pago({
                oc: 'oneclicknoactivo',
                username: 'juanviera89',
                type: 'oneclick',
                amount: 1400,
                equipos: [{
                    serial: 'String',
                    price: 1500
                }],
                tbk: {
                    tipo: 'oc',
                    exito: true,
                    date: Date.now()
                },
                createdAt: Date.now()
            })).save();
            (new pago({
                oc: 'oneclickactivo',
                username: 'someuser',
                type: 'oneclick',
                amount: 1400,
                equipos: [{
                    serial: 'String',
                    price: 1500,
                    activated: true,
                    date: Date.now()
                }],
                tbk: {
                    tipo: 'oc',
                    exito: true,
                    date: Date.now()
                },
                createdAt: Date.now()
            })).save();
            (new pago({
                oc: 'webpaynoactivo',
                username: 'someuser',
                type: 'webpay',
                amount: 1400,
                equipos: [{
                    serial: 'String',
                    price: 1500
                }],
                tbk: {
                    tipo: 'cc',
                    exito: true,
                    date: Date.now()
                },
                createdAt: Date.now()
            })).save();
        })
        it('Should return a json object with a list of done payments ', function (done) {
            chai.request(app.getApp('main'))
                .get('/pagos').set('userkey', 'juanTokenMFA').set('devkey', 'kowndevicemfa003')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    const body = res.body
                    body.list.should.be.an('array')
                    body.list[0].equipos[0].activated.should.equal(true)
                    done();
                });
        })
        it('Should return a json object with a list of unactivated payments ', function (done) {
            chai.request(app.getApp('main'))
                .get('/pagos').set('userkey', 'juanToken').set('devkey', 'kowndevice001')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    const body = res.body
                    body.list.should.be.an('array')
                    body.list[0].equipos[0].activated.should.equal(false)
                    done();
                });
        })
        it('Should return a json object with a list of done and unactivated payments ', function (done) {
            chai.request(app.getApp('main'))
                .get('/pagos').set('userkey', 'sometoken').set('devkey', 'knowndevice002')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    const body = res.body
                    body.list.should.be.an('array')
                    body.list.length.should.equal(2)
                    done();
                });
        })
        after(async function () {
            await pago.deleteMany({ oc: 'webpayactivado' }).exec();
            await pago.deleteMany({ oc: 'oneclicknoactivo' }).exec();
            await pago.deleteMany({ oc: 'oneclickactivo' }).exec();
            await pago.deleteMany({ oc: 'webpaynoactivo' }).exec();
        })
    })
})