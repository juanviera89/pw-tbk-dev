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

const wait = (done) => {
    setTimeout(() => {
        if (app.getApp('main') != undefined) {
            return done()
        }
        wait(done)
    }, 100);
}

describe('/Version', function() {
    before( function(done){
        app.waitForAppReady('main',450).then( ready => {
            if(!ready) {
                throw new Error('App server ready timeout')
            }
            done()
        })
    })
    describe('GET', function(){
        it('Should return a json object with api version and minimun app version', function(done) {
            chai.request(app.getApp('main'))
            .get('/version')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                const body = res.body
                body.version.should.be.a('string')
                body.appVersion.should.be.a('string')
                done();
             });
        })
    })
})