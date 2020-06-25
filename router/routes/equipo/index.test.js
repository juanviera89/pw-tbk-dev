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
const should = chai.should();

const equipo = rfr('db/models/equipo.js');
const sucursal = rfr('db/models/sucursal.js');
const concesionario = rfr('db/models/concesionario.js');
const pago = rfr('db/models/pago.js');
const descuento = rfr('db/models/descuento.js');

describe('/equipo', function () {
    before(function (done) {
        app.waitForAppReady('main', 800).then(ready => {
            if (!ready) {
                throw new Error('App server ready timeout')
            }
            done()
        })
    })
    describe('GET', function () {


        before(async function () {
            (new equipo({
                number: "99999",
                serial: "TST0001",
                qr: "QR99999",
                type: "lavadora",
                version: 2,
                sucursal: "autotest01",
                active: true,
                brand: "Marsol",
                model: "Prueba",
                ultimaVez: {
                    fecha: Date.now(),
                    data: "cgfh"
                }
            })).save();
            (new equipo({
                number: "99998",
                serial: "TST0002",
                qr: "QR99998",
                type: "secadora",
                version: 2,
                sucursal: "autotest02",
                active: true,
                brand: "Marsol",
                model: "Prueba",
                ultimaVez: {
                    fecha: Date.now(),
                    data: "cgfh"
                }
            })).save();
            (new equipo({
                number: "99997",
                serial: "TST0003",
                qr: "QR99997",
                type: "lavadora",
                version: 2,
                sucursal: "autotest01",
                active: true,
                brand: "Marsol",
                model: "Prueba",
                ultimaVez: {
                    fecha: "2019-11-09T21:22:51.758Z",
                    data: "cgfh"
                }
            })).save();
            (new equipo({
                number: "99996",
                serial: "TST0004",
                qr: "QR99996",
                type: "lavadora",
                version: 2,
                sucursal: "autotest01",
                active: false,
                brand: "Marsol",
                model: "Prueba",
                ultimaVez: {
                    fecha: Date.now(),
                    data: "cgfh"
                }
            })).save();
            (new equipo({
                number: "99995",
                serial: "TST0005",
                qr: "QR99995",
                type: "secadora",
                version: 2,
                sucursal: "autotest01",
                active: true,
                brand: "Marsol",
                model: "Prueba",
                ultimaVez: {
                    fecha: Date.now(),
                    data: "cgfh"
                }
            })).save();
            (new sucursal({
                consecionario: "cncsautotest001",
                code: "autotest01",
                name: "Ejercito",
                edificio: "casa matriz",
                direccion: "Ejercito 733",
                comuna: "Santiago",
                precio: {
                    lavadora: 1200,
                    secadora: 1200
                },
                createdAt: "2020-01-09T21:22:51.758Z"
            })).save();
            (new sucursal({
                consecionario: "cncsautotest001",
                code: "autotest02",
                name: "Ejercito",
                edificio: "casa matriz",
                direccion: "Ejercito 733",
                comuna: "Santiago",
                precio: {
                    lavadora: 1200,
                    secadora: 1200
                },
                createdAt: "2020-01-09T21:22:51.758Z"
            })).save();
            (new concesionario({
                code: "cncsautotest001",
                name: "Marsol",
                direccion: "Ejercito 733",
                idn: "rutmarzol",
                techPhone: "+56949085251",
                createdAt: "2020-01-09T21:22:51.758Z"
            })).save();
            (new descuento({
                name: "dscprueba",
                description: "Descuento de prueba",
                active: true,
                descuento: {
                    lavadora: 1000,
                    secadora: 1000
                },
                iDate: "2020-01-09T21:22:51.758Z",
                eDate: "2020-12-09T21:22:51.758Z",
                sucursales: ["autotest02"],
                createdAt: "2020-01-09T21:22:51.758Z"
            })).save();
            (new pago({
                oc: 'pagotest',
                username: 'juan_viera22',
                type: 'webpay',
                amount: 1400,
                equipos: [{
                    serial: 'TST0005',
                    price: 1400,
                    activated: false
                }],
                tbk: {
                    tipo: 'dc',
                    exito: true,
                    date: Date.now()
                },
                createdAt: Date.now()
            })).save();
        })
        it('Should return a json object with equipment unit info with status ok', function (done) {
            chai.request(app.getApp('main'))
                .get('/equipo?number=99999').set('userkey', 'juanTokenMFA').set('devkey', 'kowndevicemfa003')
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.equipo.should.be.an('object')
                    body.equipo.active.should.equal(true)
                    done();
                });
        })
        it('Should return a json object with equipment unit list info with status ok and discount', function (done) {
            chai.request(app.getApp('main'))
                .get('/equipo?number=99998').set('userkey', 'juanTokenMFA').set('devkey', 'kowndevicemfa003')
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.equipo.should.be.an('object')
                    body.descuento.should.be.an('object')
                    body.equipo.active.should.equal(true)
                    done();
                });
        })
        it('Should return a json object with equipment unit list info with status offline', function (done) {
            chai.request(app.getApp('main'))
                .get('/equipo?number=99997').set('userkey', 'juanTokenMFA').set('devkey', 'kowndevicemfa003')
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(409);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.equipo.should.be.an('object')
                    body.equipo.active.should.equal(false)
                    done();
                });
        })
        it('Should return a json object with equipment unit list info with status unavailable', function (done) {
            chai.request(app.getApp('main'))
                .get('/equipo?number=99996').set('userkey', 'juanTokenMFA').set('devkey', 'kowndevicemfa003')
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(409);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.equipo.should.be.an('object')
                    body.equipo.active.should.equal(false)
                    done();
                });
        })
        it('Should return a json object with equipment unit info with activation status pending', function (done) {
            chai.request(app.getApp('main'))
                .get('/equipo?number=99995').set('userkey', 'juanTokenMFA').set('devkey', 'kowndevicemfa003')
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.equipo.should.be.an('object')
                    body.equipo.active.should.equal(true)
                    body.pagosPendientes.length.should.not.equal(0)
                    done();
                });
        })
        it('Should return a 404 status with equipment not found error code', function (done) {
            chai.request(app.getApp('main'))
                .get('/equipo?number=12345679').set('userkey', 'juanTokenMFA').set('devkey', 'kowndevicemfa003')
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(404);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.message.should.be.a('string')
                    should.equal(body.equipo, null)
                    done();
                });
        })
        it('Should return a 400 status with no equipment param error code', function (done) {
            chai.request(app.getApp('main'))
                .get('/equipo').set('userkey', 'juanTokenMFA').set('devkey', 'kowndevicemfa003')
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.message.should.be.a('string')
                    should.equal(body.equipo, null)
                    done();
                });
        })
        after(async function () {
            await pago.deleteMany({ oc: 'pagotest' }).exec();
            await equipo.deleteMany({
                $or: [
                    { serial: "TST0001" },
                    { serial: "TST0002" },
                    { serial: "TST0003" },
                    { serial: "TST0004" },
                    { serial: "TST0005" }]
            }).exec();
            await sucursal.deleteMany({
                $or: [
                    { code: "autotest01" },
                    { code: "autotest02" }]
            }).exec();
            await concesionario.deleteMany({ code: "cncsautotest001" }).exec();
            await descuento.deleteMany({ name: "dscprueba" }).exec();
        })
    })
    describe('PUT', function () {
        before(async function () {
            (new equipo({
                number: "99999",
                serial: "TST0001",
                qr: "QR99999",
                type: "lavadora",
                version: 2,
                sucursal: "autotest01",
                active: true,
                brand: "Marsol",
                model: "Prueba",
                ultimaVez: {
                    fecha: Date.now(),
                    data: "cgfh"
                }
            })).save();
            (new equipo({
                number: "99997",
                serial: "TST0003",
                qr: "QR99997",
                type: "lavadora",
                version: 2,
                sucursal: "autotest01",
                active: true,
                brand: "Marsol",
                model: "Prueba",
                ultimaVez: {
                    fecha: "2019-11-09T21:22:51.758Z",
                    data: "cgfh"
                }
            })).save();
            (new equipo({
                number: "99995",
                serial: "TST0005",
                qr: "QR99995",
                type: "secadora",
                version: 2,
                sucursal: "autotest01",
                active: true,
                brand: "Marsol",
                model: "Prueba",
                ultimaVez: {
                    fecha: Date.now(),
                    data: "cgfh"
                }
            })).save();
            (new sucursal({
                consecionario: "cncsautotest001",
                code: "autotest01",
                name: "Ejercito",
                edificio: "casa matriz",
                direccion: "Ejercito 733",
                comuna: "Santiago",
                precio: {
                    lavadora: 1200,
                    secadora: 1200
                },
                createdAt: "2020-01-09T21:22:51.758Z"
            })).save();
            (new concesionario({
                code: "cncsautotest001",
                name: "Marsol",
                direccion: "Ejercito 733",
                idn: "rutmarzol",
                techPhone: "+56949085251",
                createdAt: "2020-01-09T21:22:51.758Z"
            })).save();
            (new pago({
                oc: 'pagotest',
                username: 'juan_viera22',
                type: 'webpay',
                amount: 1400,
                equipos: [{
                    serial: 'TST0005',
                    price: 1400,
                    activated: false
                }],
                tbk: {
                    tipo: 'dc',
                    exito: true,
                    date: Date.now()
                },
                createdAt: Date.now()
            })).save();
        })
        it('Should return a json object with equipment started flag true', function (done) {
            chai.request(app.getApp('main'))
                .put('/equipo').set('userkey', 'juanTokenMFA').set('devkey', 'kowndevicemfa003').send({
                    serials: ['TST0005']
                })
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.equipo.should.be.a('object')
                    body.activated.should.be.a('boolean')
                    body.activated.should.equal(true)
                    done();
                });
        })
        it('Should return a json object with equipment started flag off for offline reason', function (done) {
            chai.request(app.getApp('main'))
                .put('/equipo').set('userkey', 'juanTokenMFA').set('devkey', 'kowndevicemfa003').send({
                    serials: ['TST0003']
                })
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(409);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.message.should.be.a('string')
                    body.activated.should.be.a('boolean')
                    body.activated.should.equal(false)
                    body.equipo.should.be.a('object')
                    done();
                });
        })
        it('Should return a json object with equipments started flags off for reason unauthorized', function (done) {
            chai.request(app.getApp('main'))
                .put('/equipo').set('userkey', 'juanTokenMFA').set('devkey', 'kowndevicemfa003').send({
                    serials: ['TST0001']
                })
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(403);
                    response.body.should.be.a('object');
                    const body = response.body
                    should.equal(body.equipo, null)
                    body.message.should.be.a('string')
                    body.activated.should.be.a('boolean')
                    body.activated.should.equal(false)
                    done();
                });
        })
        it('Should return a 404 status with equipment not found error code', function (done) {
            chai.request(app.getApp('main'))
                .put('/equipo').set('userkey', 'juanTokenMFA').set('devkey', 'kowndevicemfa003').send({
                    serials: ['TST9001']
                })
                .end((err, res) => {
                    const response = err ? err.response : res;
                    response.should.have.status(404);
                    response.body.should.be.a('object');
                    const body = response.body
                    body.message.should.be.a('string')
                    should.equal(body.equipo, null)
                    body.activated.should.be.a('boolean')
                    body.activated.should.equal(false)
                    done();
                });
        })
        //TODO: test multiple activation
        after(async function () {
            await pago.deleteMany({ oc: 'pagotest' }).exec();
            await equipo.deleteMany({
                $or: [
                    { serial: "TST0001" },
                    { serial: "TST0002" },
                    { serial: "TST0003" },
                    { serial: "TST0004" },
                    { serial: "TST0005" }]
            }).exec();
            await sucursal.deleteMany({
                $or: [
                    { code: "autotest01" },
                    { code: "autotest02" }]
            }).exec();
            await concesionario.deleteMany({ code: "cncsautotest001" }).exec();
        })
    })
})