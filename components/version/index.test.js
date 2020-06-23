// Import the dependencies for testing
/* import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index.js'; */
const chai = require('chai').expect
const {pj} = require('./')
const { expect } = require('chai')

describe('Version controller', function() {
    it('Should exist: version ', function(){
        expect(pj.version).to.be.a('string')
        expect(pj["app-version"]).to.be.a('string')
    })
})