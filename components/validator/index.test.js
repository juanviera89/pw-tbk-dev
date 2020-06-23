const {
    classValidator,
    stringValidator,
    numberValidator,
    dateValidator,
    booleanValidator,
    arrayValidator,
    objectValidator,
    operators,
    validate
} = require('./');

const expect = require('chai').expect;
//TODO test type convertion like number 1 required to be boolean, or date String required to be date
describe('classValidator', function () {

    describe('string type', function () {
        it('Validate strings', function () {
            expect((new classValidator(null, 'nullString')).isString).to.be.a('boolean');
            expect((new classValidator('', 'emptyString')).isString).to.equal(true);
            expect((new classValidator('Some String', 'someString')).isString).to.equal(true);
            expect((new classValidator('1', 'numberString')).isString).to.equal(true);
            expect((new classValidator(5, 'numberSpectedString')).isString).to.equal(false);
            expect((new classValidator(true, 'booleanSpectedString')).isString).to.equal(false);
            expect((new classValidator([null], 'arraySpectedString')).isString).to.equal(false);
            expect((new classValidator(new Date(), 'dateSpectedString')).isString).to.equal(false);
            expect((new classValidator({ value: 4 }, 'objectSpectedString')).isString).to.equal(false);
            expect((new classValidator("%7B%22value%22%3Atrue%7D", 'encodedObjectSpectedString')).isString).to.equal(true);
        })
        it('Valid String', function () {
            expect((new classValidator(null, 'nullString')).ValidString).to.equal(undefined);
            expect((new classValidator('', 'emptyString')).ValidString).to.be.a('string');
            expect((new classValidator('Some String', 'someString')).ValidString).to.be.a('string');
            expect((new classValidator('1', 'numberString')).ValidString).to.be.a('string');
            expect((new classValidator(5, 'numberSpectedString')).ValidString).to.be.a('string');
            expect((new classValidator(true, 'booleanSpectedString')).ValidString).to.be.a('string');
            expect((new classValidator([null], 'arraySpectedString')).ValidString).to.equal(undefined);
            expect((new classValidator(new Date(), 'dateSpectedString')).ValidString).to.be.a('string');
            expect((new classValidator({ value: 4 }, 'objectSpectedString')).ValidString).to.equal(undefined);
            expect((new classValidator("%7B%22value%22%3Atrue%7D", 'encodedObjectSpectedString')).ValidString).to.be.a('string');
        })
    })

    describe('Number type', function () {
        it('Validate Number', function () {
            expect((new classValidator(null, 'nullString')).isNumber).to.be.a('boolean');
            expect((new classValidator('', 'emptyString')).isNumber).to.equal(true);
            expect((new classValidator('Some String', 'someString')).isNumber).to.equal(false);
            expect((new classValidator('1', 'numberString')).isNumber).to.equal(true);
            expect((new classValidator(5, 'numberSpectedString')).isNumber).to.equal(true);
            expect((new classValidator(true, 'booleanSpectedString')).isNumber).to.equal(true);
            expect((new classValidator([null], 'arraySpectedString')).isNumber).to.equal(false);
            expect((new classValidator(new Date(), 'dateSpectedString')).isNumber).to.equal(true);
            expect((new classValidator({ value: 4 }, 'objectSpectedString')).isNumber).to.equal(false);
            expect((new classValidator("%7B%22value%22%3Atrue%7D", 'encodedObjectSpectedString')).isNumber).to.equal(false);
        })
        it('Valid Number', function () {
            expect((new classValidator(null, 'nullString')).ValidNumber).to.equal(undefined);
            expect((new classValidator('', 'emptyString')).ValidNumber).to.be.a('number');
            expect((new classValidator('Some String', 'someString')).ValidNumber).to.equal(undefined);
            expect((new classValidator('1', 'numberString')).ValidNumber).to.be.a('number');
            expect((new classValidator(5, 'numberSpectedString')).ValidNumber).to.be.a('number');
            expect((new classValidator(true, 'booleanSpectedString')).ValidNumber).to.be.a('number');
            expect((new classValidator([null], 'arraySpectedString')).ValidNumber).to.equal(undefined);
            expect((new classValidator(new Date(), 'dateSpectedString')).ValidNumber).to.be.a('number');
            expect((new classValidator({ value: 4 }, 'objectSpectedString')).ValidNumber).to.equal(undefined);
            expect((new classValidator("%7B%22value%22%3Atrue%7D", 'encodedObjectSpectedString')).ValidNumber).to.equal(undefined);
        })
    })

    describe('Boolean type', function () { // TODO: corregir nombres al inicializar classvalidator para cada valor
        it('Validate Boolean', function () {
            expect((new classValidator(null, 'nullString')).isBoolean).to.be.a('boolean');
            expect((new classValidator('', 'emptyString')).isBoolean).to.equal(false);
            expect((new classValidator('Some String', 'someString')).isBoolean).to.equal(false);
            expect((new classValidator('1', 'numberString')).isBoolean).to.equal(false);
            expect((new classValidator(5, 'numberSpectedString')).isBoolean).to.equal(false);
            expect((new classValidator(1, 'positiveNumberSpectedString')).isBoolean).to.equal(false);
            expect((new classValidator(0, 'zeroSpectedString')).isBoolean).to.equal(false);
            expect((new classValidator(-1, 'negativeNumberSpectedString')).isBoolean).to.equal(false);
            expect((new classValidator('false', 'booleanStringSpectedBoolean')).isBoolean).to.equal(false);
            expect((new classValidator(true, 'booleanSpectedString')).isBoolean).to.equal(true);
            expect((new classValidator([null], 'arraySpectedString')).isBoolean).to.equal(false);
            expect((new classValidator(new Date(), 'dateSpectedString')).isBoolean).to.equal(false);
            expect((new classValidator({ value: 4 }, 'objectSpectedString')).isBoolean).to.equal(false);
            expect((new classValidator("%7B%22value%22%3Atrue%7D", 'encodedObjectSpectedString')).isBoolean).to.equal(false);
        })
        it('Valid Boolean', function () {
            expect((new classValidator(null, 'null')).ValidBoolean).to.equal(undefined);
            expect((new classValidator('', 'emptyString')).ValidBoolean).to.equal(undefined);
            expect((new classValidator('Some String', 'someString')).ValidBoolean).to.equal(undefined);
            expect((new classValidator('1', 'numberString')).ValidBoolean).to.be.a('boolean');
            expect((new classValidator(5, 'numberSpectedString')).ValidBoolean).to.equal(undefined);
            expect((new classValidator(1, 'positiveNumberSpectedString')).ValidBoolean).to.be.a('boolean');
            expect((new classValidator(-1, 'negativeNumberSpectedString')).ValidBoolean).to.be.a('boolean');
            expect((new classValidator('false', 'booleanStringSpectedBoolean')).ValidBoolean).to.be.a('boolean');
            expect((new classValidator(true, 'booleanSpectedString')).ValidBoolean).to.be.a('boolean');
            expect((new classValidator([null], 'arraySpectedString')).ValidBoolean).to.equal(undefined);
            expect((new classValidator(new Date(), 'dateSpectedString')).ValidBoolean).to.equal(undefined);
            expect((new classValidator({ value: 4 }, 'objectSpectedString')).ValidBoolean).to.equal(undefined);
            expect((new classValidator("%7B%22value%22%3Atrue%7D", 'encodedObjectSpectedString')).ValidBoolean).to.equal(undefined);
        })
    })


    describe('Array type', function () { // TODO: corregir nombres al inicializar classvalidator para cada valor
        it('Validate Array', function () {
            expect((new classValidator(null, 'nullString')).isArray).to.be.a('boolean');
            expect((new classValidator('', 'emptyString')).isArray).to.equal(false);
            expect((new classValidator('Some String', 'someString')).isArray).to.equal(false);
            expect((new classValidator('1', 'numberString')).isArray).to.equal(false);
            expect((new classValidator(5, 'numberSpectedString')).isArray).to.equal(false);
            expect((new classValidator(1, 'positiveNumberSpectedString')).isArray).to.equal(false);
            expect((new classValidator(0, 'zeroSpectedString')).isArray).to.equal(false);
            expect((new classValidator(-1, 'negativeNumberSpectedString')).isArray).to.equal(false);
            expect((new classValidator('false', 'booleanStringSpectedBoolean')).isArray).to.equal(false);
            expect((new classValidator(true, 'booleanSpectedString')).isArray).to.equal(false);
            expect((new classValidator([null], 'arraySpectedString')).isArray).to.equal(true);
            expect((new classValidator([], 'emptyArray')).isArray).to.equal(true);
            expect((new classValidator([1, 'asd', true, { value: null }], 'multiTypeArray')).isArray).to.equal(true);
            expect((new classValidator([1, ['asd', true, { value: null }]], 'multiDimensionalArray')).isArray).to.equal(true);
            expect((new classValidator(new Date(), 'dateSpectedString')).isArray).to.equal(false);
            expect((new classValidator({ value: 4 }, 'objectSpectedString')).isArray).to.equal(false);
            expect((new classValidator("%7B%22value%22%3Atrue%7D", 'encodedObjectSpectedString')).isArray).to.equal(false);
        })
        it('Valid Array', function () {
            expect((new classValidator(null, 'null')).ValidArray).to.equal(undefined);
            expect((new classValidator('', 'emptyString')).ValidArray).to.equal(undefined);
            expect((new classValidator('Some String', 'someString')).ValidArray).to.equal(undefined);
            expect((new classValidator('1', 'numberString')).ValidArray).to.equal(undefined);
            expect((new classValidator(5, 'numberSpectedString')).ValidArray).to.equal(undefined);
            expect((new classValidator(1, 'positiveNumberSpectedString')).ValidArray).to.equal(undefined);
            expect((new classValidator(-1, 'negativeNumberSpectedString')).ValidArray).to.equal(undefined);
            expect((new classValidator('false', 'booleanStringSpectedBoolean')).ValidArray).to.equal(undefined);
            expect((new classValidator(true, 'booleanSpectedString')).ValidArray).to.equal(undefined);
            expect((new classValidator([null], 'arraySpectedString')).ValidArray).to.be.an('array');
            expect((new classValidator([], 'emptyArray')).ValidArray).to.be.an('array');
            expect((new classValidator([1, 'asd', true, { value: null }], 'multiTypeArray')).ValidArray).to.be.an('array');
            expect((new classValidator([1, ['asd', true, { value: null }]], 'multiDimensionalArray')).ValidArray).to.be.an('array');
            expect((new classValidator(new Date(), 'dateSpectedString')).ValidArray).to.equal(undefined);
            expect((new classValidator({ value: 4 }, 'objectSpectedString')).ValidArray).to.equal(undefined);
            expect((new classValidator("%7B%22value%22%3Atrue%7D", 'encodedObjectSpectedString')).ValidArray).to.equal(undefined);
        })
    })



    describe('Object type', function () {
        it('Validate Object', function () {
            expect((new classValidator(null, 'nullString')).isObject).to.be.a('boolean');
            expect((new classValidator('', 'emptyString')).isObject).to.equal(false);
            expect((new classValidator('Some String', 'someString')).isObject).to.equal(false);
            expect((new classValidator('1', 'numberString')).isObject).to.equal(false);
            expect((new classValidator(5, 'numberSpectedString')).isObject).to.equal(false);
            expect((new classValidator(true, 'booleanSpectedString')).isObject).to.equal(false);
            expect((new classValidator([null], 'arraySpectedString')).isObject).to.equal(false);
            expect((new classValidator(new Date(), 'dateSpectedString')).isObject).to.equal(false);
            expect((new classValidator({ value: 4 }, 'objectSpectedString')).isObject).to.equal(true);
            expect((new classValidator({ value: 4, obj: { another: 'value', withArray: [1, 3] } }, 'nestedObject')).isObject).to.equal(true);
            expect((new classValidator("%7B%22value%22%3Atrue%7D", 'encodedObjectSpectedString')).isObject).to.equal(false);
        })
        it('Valid Object', function () {
            expect((new classValidator(null, 'nullString')).ValidObject).to.equal(undefined);
            expect((new classValidator('', 'emptyString')).ValidObject).to.equal(undefined);
            expect((new classValidator('Some String', 'someString')).ValidObject).to.equal(undefined);
            expect((new classValidator('1', 'numberString')).ValidObject).to.equal(undefined);
            expect((new classValidator(5, 'numberSpectedString')).ValidObject).to.equal(undefined);
            expect((new classValidator(true, 'booleanSpectedString')).ValidObject).to.equal(undefined);
            expect((new classValidator([null], 'arraySpectedString')).ValidObject).to.equal(undefined);
            expect((new classValidator(new Date(), 'dateSpectedString')).ValidObject).to.equal(undefined);
            expect((new classValidator({ value: 4 }, 'objectSpectedString')).ValidObject).to.be.a('object');;
            expect((new classValidator({ value: 4, obj: { another: 'value', withArray: [1, 3] } }, 'nestedObject')).ValidObject).be.a('object');
            expect((new classValidator("%7B%22value%22%3Atrue%7D", 'encodedObjectSpectedString')).ValidObject).to.equal(undefined);
        })
    })

})
describe('Type operators', function () {

    describe('String operator', function () {

        it('Should be Valid with no errors', function () {
            const s = 'This is some String'
            const v = new stringValidator(s, 'validString', {})
            expect(v.valid).to.equal(true);
            expect(v.error).to.equal(false);
            expect(v.val).to.be.a('string');
        })

        it('Should not be Valid with no errors', function () {
            const s = new Date()
            const v = new stringValidator(s, 'invalidString', {})
            expect(v.valid).to.equal(false);
            expect(v.error).to.equal(false);
            expect(v.val).to.equal(undefined);
        })

        it('Should not be Valid with errors', function () {
            const s = new Date()
            const v = new stringValidator(s, 'invalidString', { required: true })
            expect(v.valid).to.equal(false);
            expect(v.error).to.equal(true);
            expect(v.val).to.equal(undefined);
        })

        describe('String operators options', function () {

            it('Should be valid for a minLength with no errors', function () {
                const s = 'This is some String'
                const v = new stringValidator(s, 'validString', { minLength: 3 })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('string');

            })

            it('Should be valid for a maxLength with no errors', function () {
                const s = 'This is some String'
                const v = new stringValidator(s, 'validString', { maxLength: 20 })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('string');

            })

            it('Should be valid for a range length with no errors', function () {
                const s = 'This is some String'
                const v = new stringValidator(s, 'validString', { minLength: 3, maxLength: 20 })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('string');

            })

            it('Should be valid for a minLength with errors', function () {
                const s = 'This is some String'
                const v = new stringValidator(s, 'validString', { minLength: 20 })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(true);
                expect(v.val).to.be.a('string');

            })

            it('Should be valid for a maxLength with errors', function () {
                const s = 'This is some String'
                const v = new stringValidator(s, 'validString', { maxLength: 5 })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(true);
                expect(v.val).to.be.a('string');

            })

            it('Should be valid for a range length with errors', function () {
                const s = 'This is some String'
                const v = new stringValidator(s, 'validString', { minLength: 30, maxLength: 40 })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(true);
                expect(v.val).to.be.a('string');

            })


            it('Should not be valid for a range length with no errors', function () {
                const s = new Date()
                const v = new stringValidator(s, 'invalidString', { minLength: 3, maxLength: 20, required: false })
                expect(v.valid).to.equal(false);
                expect(v.error).to.equal(false);
                expect(v.val).to.equal(undefined);

            })


            it('Should not be valid for a range length with errors', function () {
                const s = new Date()
                const v = new stringValidator(s, 'invalidString', { minLength: 3, maxLength: 20, required: true })
                expect(v.valid).to.equal(false);
                expect(v.error).to.equal(true);
                expect(v.val).to.equal(undefined);

            })

        })

        describe('String operator error at options inputs', function () {

            it('Should throw error at bad input for minLength', function () {
                const s = 'This is some String'
                let err
                let v
                try {
                    v = new stringValidator(s, 'validString', { minLength: ['5'] })
                } catch (error) {
                    err = error
                }
                expect(err).to.be.an('error');
                expect(v).to.be.an('undefined');
            })

            it('Should throw error at bad input for maxLength', function () {
                const s = 'This is some String'
                let err
                let v
                try {
                    v = new stringValidator(s, 'validString', { maxLength: 'max 5' })
                } catch (error) {
                    err = error
                }
                expect(err).to.be.an('error');
                expect(v).to.be.an('undefined');
            })

        })

    })

    describe('Number operator', function () {

        it('Should be Valid with no errors', function () {
            const s = 5
            const v = new numberValidator(s, 'validNumber', {})
            expect(v.valid).to.equal(true);
            expect(v.error).to.equal(false);
            expect(v.val).to.be.a('number');
        })

        it('Should be Valid being a string with no errors', function () {
            const s = '5'
            const v = new numberValidator(s, 'validNumber', {})
            expect(v.valid).to.equal(true);
            expect(v.error).to.equal(false);
            expect(v.val).to.be.a('number');
        })

        it('Should be Valid being a boolean with no errors', function () {
            const s = false
            const v = new numberValidator(s, 'validNumber', {})
            expect(v.valid).to.equal(true);
            expect(v.error).to.equal(false);
            expect(v.val).to.be.a('number');
        })

        it('Should not be Valid with no errors', function () {
            const s = 'number 5'
            const v = new numberValidator(s, 'invalidNumber', {})
            expect(v.valid).to.equal(false);
            expect(v.error).to.equal(false);
            expect(v.val).to.be.an('undefined');
        })

        it('Should not be Valid with errors', function () {
            const s = 'number 5'
            const v = new numberValidator(s, 'invalidNumber', { required: true })
            expect(v.valid).to.equal(false);
            expect(v.error).to.equal(true);
            expect(v.val).to.be.an('undefined');
        })

        describe('Number operators options', function () {

            it('Should be valid for a min value with no errors', function () {
                const s = 5
                const v = new numberValidator(s, 'validNumber', { min: 2 })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('number');
            })

            it('Should be valid for a max value with no errors', function () {
                const s = 5
                const v = new numberValidator(s, 'validNumber', { max: 10 })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('number');
            })

            it('Should be valid for a range length with no errors', function () {
                const s = 5
                const v = new numberValidator(s, 'validNumber', { min: 1, max: 100 })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('number');
            })

            it('Should be valid for a integer type with no errors', function () {
                const s = 5
                const v = new numberValidator(s, 'validNumber', { integer: true })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('number');
            })

            it('Should be valid for a min value with errors', function () {
                const s = 5
                const v = new numberValidator(s, 'validNumber', { min: 10 })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(true);
                expect(v.val).to.be.an('number');
            })

            it('Should be valid for a max value with errors', function () {
                const s = 5
                const v = new numberValidator(s, 'validNumber', { max: 1 })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(true);
                expect(v.val).to.be.a('number');
            })

            it('Should be valid for a range  with errors', function () {
                const s = 5
                const v = new numberValidator(s, 'validNumber', { min: 10, max: 20 })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(true);
                expect(v.val).to.be.a('number');
            })

            it('Should be valid for a integer type with  errors', function () {
                const s = 5.5
                const v = new numberValidator(s, 'validNumber', { integer: true })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(true);
                expect(v.val).to.be.a('number');
            })

            it('Should not be valid for a range  with no errors', function () {
                const s = new Date()
                const v = new numberValidator(s, 'invalidNumber', { min: 3, max: 20, required: false })
                expect(v.valid).to.equal(false);
                expect(v.error).to.equal(false);
                expect(v.val).to.equal(undefined);

            })


            it('Should not be valid for a range  with errors', function () {
                const s = new Date()
                const v = new numberValidator(s, 'invalidNumber', { min: 3, max: 20, required: true })
                expect(v.valid).to.equal(false);
                expect(v.error).to.equal(true);
                expect(v.val).to.equal(undefined);

            })

        })

        describe('String operator error at options inputs', function () {

            it('Should throw error at bad input for min ', function () {
                const s = 5
                let err
                let v
                try {
                    v = new numberValidator(s, 'validNumber', { min: ['5'] })
                } catch (error) {
                    err = error
                }
                expect(err).to.be.an('error');
                expect(v).to.be.an('undefined');
            })

            it('Should throw error at bad input for max', function () {
                const s = 5
                let err
                let v
                try {
                    v = new numberValidator(s, 'validNumber', { max: 'max 5' })
                } catch (error) {
                    err = error
                }
                expect(err).to.be.an('error');
                expect(v).to.be.an('undefined');
            })

            it('Should throw error at bad input for integer', function () {
                const s = 5
                let err
                let v
                try {
                    v = new numberValidator(s, 'validNumber', { integer: [true] })
                } catch (error) {
                    err = error
                }
                expect(err).to.be.an('error');
                expect(v).to.be.an('undefined');
            })

        })

    })

    describe('Date operator', function () {

        it('Should be Valid with no errors', function () {
            const s = new Date()
            const v = new dateValidator(s, 'validDate', {})
            expect(v.valid).to.equal(true);
            expect(v.error).to.equal(false);
            expect(v.val).to.be.a('date');
        })

        it('Should be Valid being a compatible string with no errors', function () {
            const s = (new Date()).toISOString()
            const v = new dateValidator(s, 'validDate', {})
            expect(v.valid).to.equal(true);
            expect(v.error).to.equal(false);
            expect(v.val).to.be.a('date');
        })

        it('Should be Valid being a compatible number with no errors', function () {
            const s = (new Date()).getTime() - 5000
            const v = new dateValidator(s, 'validDate', {})
            expect(v.valid).to.equal(true);
            expect(v.error).to.equal(false);
            expect(v.val).to.be.a('date');
        })

        it('Should not be Valid with no errors', function () {
            const s = 'new Date()'
            const v = new dateValidator(s, 'invvalidDate', {})
            expect(v.valid).to.equal(false);
            expect(v.error).to.equal(false);
            expect(v.val).to.equal(undefined);
        })

        it('Should not be Valid with errors', function () {
            const s = 'new Date()'
            const v = new dateValidator(s, 'invvalidDate', { required: true })
            expect(v.valid).to.equal(false);
            expect(v.error).to.equal(true);
            expect(v.val).to.equal(undefined);
        })

        describe('Date operators options', function () {

            it('Should be valid for a min value with no errors', function () {
                const s = new Date()
                const min = new Date()
                min.setDate(min.getDate() - 1)
                const v = new dateValidator(s, 'validDate', { min })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('date');
            })

            it('Should be valid for a max value with no errors', function () {
                const s = new Date()
                const max = new Date()
                max.setDate(max.getDate() + 1)
                const v = new dateValidator(s, 'validDate', { max: max.toISOString() })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('date');
            })

            it('Should be valid for a range length with no errors', function () {
                const s = new Date()
                const max = new Date()
                max.setDate(max.getDate() + 1)
                const min = new Date()
                min.setDate(min.getDate() - 1)
                const v = new dateValidator(s, 'validDate', { min, max })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('date');
            })

            it('Should be valid for a min value with errors', function () {
                const s = new Date()
                const min = new Date()
                min.setDate(min.getDate() + 1)
                const v = new dateValidator(s, 'validDate', { min })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(true);
                expect(v.val).to.be.a('date');
            })

            it('Should be valid for a max value with errors', function () {
                const s = new Date()
                const max = new Date()
                max.setDate(max.getDate() - 11)
                const v = new dateValidator(s, 'validDate', { max })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(true);
                expect(v.val).to.be.a('date');
            })

            it('Should be valid for a range length with errors', function () {
                const s = new Date()
                const max = new Date()
                max.setDate(max.getDate() + 11)
                const min = new Date()
                min.setDate(min.getDate() + 1)
                const v = new dateValidator(s, 'validDate', { min, max })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(true);
                expect(v.val).to.be.a('date');
            })


            it('Should not be valid for a range length with no errors', function () {
                const s = 'i am not a date'
                const max = new Date()
                max.setDate(max.getDate() + 11)
                const min = new Date()
                min.setDate(min.getDate() + 1)
                const v = new dateValidator(s, 'validDate', { min, max, required: false })
                expect(v.valid).to.equal(false);
                expect(v.error).to.equal(false);
                expect(v.val).to.equal(undefined);

            })


            it('Should not be valid for a range length with errors', function () {
                const s = 'i am not a date'
                const max = new Date()
                max.setDate(max.getDate() + 11)
                const min = new Date()
                min.setDate(min.getDate() + 1)
                const v = new dateValidator(s, 'validDate', { min, max, required: true })
                expect(v.valid).to.equal(false);
                expect(v.error).to.equal(true);
                expect(v.val).to.equal(undefined);

            })

        })

        describe('String operator error at options inputs', function () {

            it('Should throw error at bad input for min', function () {
                const s = new Date()
                let err
                let v
                try {
                    v = new dateValidator(s, 'validDate', { min: [new Date()] })
                } catch (error) {
                    err = error
                }
                expect(err).to.be.an('error');
                expect(v).to.be.an('undefined');
            })

            it('Should throw error at bad input for max', function () {
                const s = new Date()
                let err
                let v
                try {
                    v = new dateValidator(s, 'validDate', { max: (new Date()).toISOString() + ' some not allowed string' })
                } catch (error) {
                    err = error
                }
                expect(err).to.be.an('error');
                expect(v).to.be.an('undefined');
            })

        })

    })

    describe('Boolean operator', function () {

        it('Should be Valid with no errors', function () {
            const s = true
            const v = new booleanValidator(s, 'validBoolean', {})
            expect(v.valid).to.equal(true);
            expect(v.error).to.equal(false);
            expect(v.val).to.be.a('boolean');
        })

        it('Should be Valid being a string with no errors', function () {
            const s = 'true'
            const v = new booleanValidator(s, 'validBoolean', {})
            expect(v.valid).to.equal(true);
            expect(v.error).to.equal(false);
            expect(v.val).to.be.a('boolean');
        })

        it('Should be Valid being a number with no errors', function () {
            const s = 1
            const v = new booleanValidator(s, 'validBoolean', {})
            expect(v.valid).to.equal(true);
            expect(v.error).to.equal(false);
            expect(v.val).to.be.a('boolean');
        })

        it('Should be Valid being a string number with no errors', function () {
            const s = '0'
            const v = new booleanValidator(s, 'validBoolean', {})
            expect(v.valid).to.equal(true);
            expect(v.error).to.equal(false);
            expect(v.val).to.be.a('boolean');
        })

        it('Should be Valid being a negative number between -1 and 0 with no errors', function () {
            const s = -1 * Math.random()
            const v = new booleanValidator(s, 'validBoolean', {})
            expect(v.valid).to.equal(true);
            expect(v.error).to.equal(false);
            expect(v.val).to.be.a('boolean');
        })

        it('Should not be Valid with no errors', function () {
            const s = new Date()
            const v = new booleanValidator(s, 'invalidBoolean', {})
            expect(v.valid).to.equal(false);
            expect(v.error).to.equal(false);
            expect(v.val).to.equal(undefined);
        })

        it('Should not be Valid with errors', function () {
            const s = new Date()
            const v = new booleanValidator(s, 'invalidBoolean', { required: true })
            expect(v.valid).to.equal(false);
            expect(v.error).to.equal(true);
            expect(v.val).to.equal(undefined);
        })

    })

    describe('Array operator', function () {

        it('Should be Valid with no errors', function () {
            const s = [1, 'string', [true]]
            const v = new arrayValidator(s, 'validArray', {})
            expect(v.valid).to.equal(true);
            expect(v.error).to.equal(false);
            expect(v.val).to.be.an('array');
        })

        it('Should not be Valid with no errors', function () {
            const s = new Date()
            const v = new arrayValidator(s, 'invalidArray', {})
            expect(v.valid).to.equal(false);
            expect(v.error).to.equal(false);
            expect(v.val).to.equal(undefined);
        })

        it('Should not be Valid with errors', function () {
            const s = new Date()
            const v = new arrayValidator(s, 'invalidArray', { required: true })
            expect(v.valid).to.equal(false);
            expect(v.error).to.equal(true);
            expect(v.val).to.equal(undefined);
        })

        describe('Array operators options', function () {

            it('Should be valid for a minLength with no errors', function () {
                const s = [1, 'string', [true]]
                const v = new arrayValidator(s, 'validArray', { minLength: 2 })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.an('array');

            })

            it('Should be valid for a maxLength with no errors', function () {
                const s = [1, 'string', [true]]
                const v = new arrayValidator(s, 'validArray', { maxLength: 20 })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.an('array');

            })

            it('Should be valid for a range length with no errors', function () {
                const s = [1, 'string', [true, new Date()]]
                const v = new arrayValidator(s, 'validArray', { minLength: 3, maxLength: 20 })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.an('array');

            })

            it('Should be valid for a minLength with errors', function () {
                const s = [1, 'string', [true, new Date()]]
                const v = new arrayValidator(s, 'validArray', { minLength: 4 })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(true);
                expect(v.val).to.be.an('array');

            })

            it('Should be valid for a maxLength with errors', function () {
                const s = [1, 'string', [true, new Date()]]
                const v = new arrayValidator(s, 'validArray', { maxLength: 2 })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(true);
                expect(v.val).to.be.an('array');

            })

            it('Should be valid for a range length with errors', function () {
                const s = [1, 'string', [true, new Date()]]
                const v = new arrayValidator(s, 'validArray', { minLength: 30, maxLength: 40 })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(true);
                expect(v.val).to.be.an('array');

            })


            it('Should not be valid for a range length with no errors', function () {
                const s = new Date()
                const v = new arrayValidator(s, 'validArray', { minLength: 3, maxLength: 20, required: false })
                expect(v.valid).to.equal(false);
                expect(v.error).to.equal(false);
                expect(v.val).to.equal(undefined);

            })


            it('Should not be valid for a range length with errors', function () {
                const s = new Date()
                const v = new arrayValidator(s, 'validArray', { minLength: 3, maxLength: 20, required: true })
                expect(v.valid).to.equal(false);
                expect(v.error).to.equal(true);
                expect(v.val).to.equal(undefined);

            })

        })

        describe('Array operator error at options inputs', function () {

            it('Should throw error at bad input for minLength', function () {
                const s = [1, 'string', [true, new Date()]]
                let err
                let v
                try {
                    v = new arrayValidator(s, 'validString', { minLength: ['5'] })
                } catch (error) {
                    err = error
                }
                expect(err).to.be.an('error');
                expect(v).to.be.an('undefined');
            })

            it('Should throw error at bad input for maxLength', function () {
                const s = [1, 'string', [true, new Date()]]
                let err
                let v
                try {
                    v = new arrayValidator(s, 'validString', { maxLength: 'max 5' })
                } catch (error) {
                    err = error
                }
                expect(err).to.be.an('error');
                expect(v).to.be.an('undefined');
            })

            it('Should throw error at bad input for type', function () {
                const s = [1, 'string', [true, new Date()]]
                let err
                let v
                try {
                    v = new arrayValidator(s, 'validString', { items: true })
                } catch (error) {
                    err = error
                }
                expect(err).to.be.an('error');
                expect(v).to.be.an('undefined');
            })

        })

        describe('Array item types specified at options inputs', function () {

            it('Should be valid with no errors for item tipe with string format', function () {
                const s = [1, 2]
                const v = new arrayValidator(s, 'validArray', { items: 'number' })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.an('array');

            })

            it('Should be valid with errors for item tipe with string format', function () {
                const s = [true, [false]]
                const v = new arrayValidator(s, 'validArray', { items: 'string' })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(true);
                expect(v.val).to.be.an('array');

            })

            it('Should be valid with no errors for item tipe with array format', function () {
                const s = [1, [2]]
                const v = new arrayValidator(s, 'validArray', { items: ['number', 'array'] })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.an('array');

            })

            it('Should be valid with errors for item tipe with array format', function () {
                const s = [true, [false]]
                const v = new arrayValidator(s, 'validArray', { items: ['string', 'date'] })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(true);
                expect(v.val).to.be.an('array');

            })

            it('Should be valid with no errors for item tipe with object format', function () {
                const s = [1, 2]
                const items = {
                    'number': {
                        max: 5
                    },
                    'boolean': {

                    }
                }
                const v = new arrayValidator(s, 'validArray', { items })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.an('array');

            })

            it('Should be valid with errors for item tipe with object format', function () {
                const s = [true, [false]]
                const items = {
                    boolean: {

                    },
                    array: {
                        items: 'boolean'
                    }
                }
                const v = new arrayValidator(s, 'validArray', { items })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(true);
                expect(v.val).to.be.an('array');

            })

            describe('Bad type input at items type input', function () {

                it('should throw error at not validable type in item type input in string format', function () {
                    const s = [1, 'string', [true, new Date()]]
                    let err
                    let v
                    try {
                        v = new arrayValidator(s, 'validString', { items: 'notValid' })
                    } catch (error) {
                        err = error
                    }
                    expect(err).to.be.an('error');
                    expect(v).to.be.an('undefined');
                })

                it('should throw error at not validable type in item type input in array format', function () {
                    const s = [1, 'string', [true, new Date()]]
                    let err
                    let v
                    try {
                        v = new arrayValidator(s, 'validString', { items: ['5'] })
                    } catch (error) {
                        err = error
                    }
                    expect(err).to.be.an('error');
                    expect(v).to.be.an('undefined');
                })

                it('should throw error at not validable type in item type input in object format', function () {
                    const s = [1, 'string', [true, new Date()]]
                    let err
                    let v
                    try {
                        v = new arrayValidator(s, 'validString', { items: { badInput: { someProperty: true } } })
                    } catch (error) {
                        err = error
                    }
                    expect(err).to.be.an('error');
                    expect(v).to.be.an('undefined');
                })
            })

        })

    })

    describe('Object operator', function () {

        it('Should be Valid with no errors', function () {
            const s = { someValue: 5 }
            const v = new objectValidator(s, 'validObject', {})
            expect(v.valid).to.equal(true);
            expect(v.error).to.equal(false);
            expect(v.val).to.be.a('object');
        })

        it('Should not be Valid with no errors', function () {
            const s = new Date()
            const v = new objectValidator(s, 'invalidObject', {})
            expect(v.valid).to.equal(false);
            expect(v.error).to.equal(false);
            expect(v.val).to.equal(undefined);
        })

        it('Should not be Valid with errors', function () {
            const s = [new Date()]
            const v = new objectValidator(s, 'invalidObject', { required: true })
            expect(v.valid).to.equal(false);
            expect(v.error).to.equal(true);
            expect(v.val).to.equal(undefined);
        })

        describe('Object properties types specified', function () {

            it('Should be Valid with no errors for a number property', function () {
                const s = { someNumber: 5 }
                const v = new objectValidator(s, 'validObject', { properties: { someNumber: 'number' } })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('object');
            })

            it('Should be Valid with no errors for a string property', function () {
                const s = { someString: 'some String' }
                const v = new objectValidator(s, 'validObject', { properties: { someString: 'string' } })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('object');
            })

            it('Should be Valid with no errors for a boolean property', function () {
                const s = { someBoolean: true }
                const v = new objectValidator(s, 'validObject', { properties: { someBoolean: 'boolean' } })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('object');
            })

            it('Should be Valid with no errors for a date property', function () {
                const s = { someDate: new Date() }
                const v = new objectValidator(s, 'validObject', { properties: { someDate: 'date' } })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('object');
            })

            it('Should be Valid with no errors for a array property', function () {
                const s = { someArray: [1, 2, 3] }
                const v = new objectValidator(s, 'validObject', { properties: { someDate: 'array' } })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('object');
            })

            it('Should be Valid with no errors for a object property', function () {
                const s = { someObject: { someProperty: 'someValue' } }
                const v = new objectValidator(s, 'validObject', { properties: { someObject: 'object' } })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('object');
            })

        })

        describe('Object properties types specified with options', function () {

            it('Should be Valid with no errors for a number property and max option', function () {
                const s = { someNumber: 5 }
                const v = new objectValidator(s, 'validObject', { properties: { someNumber: { type: 'number', max: 10 } } })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('object');
            })

            it('Should be Valid with errors for a number property and max option', function () {
                const s = { someNumber: 5 }
                const v = new objectValidator(s, 'validObject', { properties: { someNumber: { type: 'number', max: 3 } } })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(true);
                expect(v.val).to.be.a('object');
            })

            it('Should be Valid with no errors for a string property and max length option', function () {
                const s = { someString: 'some String' }
                const v = new objectValidator(s, 'validObject', { properties: { someString: { type: 'string', maxLength: 25 } } })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('object');
            })

            it('Should be Valid with errors for a string property and max length option', function () {
                const s = { someString: 'some String' }
                const v = new objectValidator(s, 'validObject', { properties: { someString: { type: 'string', maxLength: 5 } } })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(true);
                expect(v.val).to.be.a('object');
            })

            it('Should be Valid with no errors for a boolean property with type in options', function () {
                const s = { someBoolean: true }
                const v = new objectValidator(s, 'validObject', { properties: { someBoolean: { type: 'boolean' } } })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('object');
            })

            it('Should be Valid with no errors for a date property with min option', function () {
                const s = { someDate: new Date() }
                const min = new Date()
                min.setDate(min.getDate() - 1)
                const v = new objectValidator(s, 'validObject', { properties: { someDate: { type: 'date', min } } })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('object');
            })

            it('Should be Valid with errors for a date property with min option', function () {
                const s = { someDate: new Date() }
                const min = new Date()
                min.setDate(min.getDate() + 10)
                const v = new objectValidator(s, 'validObject', { properties: { someDate: { type: 'date', min } } })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(true);
                expect(v.val).to.be.a('object');
            })

            it('Should be Valid with no errors for a array property with min length', function () {
                const s = { someArray: [1, 2, 3] }
                const v = new objectValidator(s, 'validObject', { properties: { someArray: { type: 'array', minLength: 2 } } })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('object');
            })

            it('Should be Valid with  errors for a array property with min length', function () {
                const s = { someArray: [1, 2, 3] }
                const v = new objectValidator(s, 'validObject', { properties: { someArray: { type: 'array', minLength: 10 } } })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(true);
                expect(v.val).to.be.a('object');
            })

            it('Should be Valid with no errors for a object property type in options', function () {
                const s = { someObject: { someProperty: 'someValue' } }
                const v = new objectValidator(s, 'validObject', { properties: { someObject: { type: 'object' } } })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('object');
            })

        })



        describe('Object properties types specified with nested objects', function () {

            it('Should be Valid with no errors for a object property type in options', function () {
                const s = {
                    someObject: {
                        someProperty: 'someValue',
                        someNumber: 5,
                        someArray: [1, 2, 3],
                        someDate: new Date(),
                        someNestedObject: {
                            someString: 'some String',
                            someBoolean: true
                        }
                    }
                }
                const v = new objectValidator(s, 'validObject', {
                    properties: {
                        someObject: {
                            type: 'object',
                            properties: {
                                someProperty: 'string',
                                someNumber: 'number',
                                someArray: 'array',
                                someDate: 'date',
                                someNestedObject: {
                                    type: 'object',
                                    properties: {
                                        someString: 'string',
                                        someBoolean: {
                                            type: 'boolean'
                                        }
                                    }
                                }
                            }
                        },
                    }
                })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('object');
            })

            it('Should be Valid with  errors for a object property type in options', function () {
                const s = {
                    someObject: {
                        someProperty: 'someValue',
                        someNumber: 5,
                        someArray: [1, 2, 3],
                        someDate: new Date(),
                        someNestedObject: {
                            someString: 'some String',
                            someBoolean: true
                        }
                    }
                }
                const v = new objectValidator(s, 'validObject', {
                    properties: {
                        someObject: {
                            type: 'object',
                            properties: {
                                someProperty: 'string',
                                someNumber: 'number',
                                someArray: 'array',
                                someDate: 'date',
                                someNestedObject: {
                                    type: 'object',
                                    properties: {
                                        someString: 'string',
                                        someBoolean: {
                                            type: 'object'
                                        }
                                    }
                                }
                            }
                        },
                    }
                })
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(true);
                expect(v.val).to.be.a('object');
            })

        })

    })

    describe('Array operator serialized', function () {

        it('Should be Valid with no errors', function () {
            const s = JSON.stringify([1, 'string', [true]])
            const v = new arrayValidator(s, 'validArray', {}, false, true)
            expect(v.valid).to.equal(true);
            expect(v.error).to.equal(false);
            expect(v.val).to.be.an('array');
        })

        describe('Array operators options', function () {

            it('Should be valid for a minLength with no errors', function () {
                const s = JSON.stringify([1, 'string', [true]])
                const v = new arrayValidator(s, 'validArray', { minLength: 2 }, false, true)
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.an('array');
            })

            it('Should be valid for a maxLength with no errors', function () {
                const s = JSON.stringify([1, 'string', [true]])
                const v = new arrayValidator(s, 'validArray', { maxLength: 20 }, false, true)
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.an('array');
            })

            it('Should be valid for a range length with no errors', function () {
                const s = JSON.stringify([1, 'string', [true, new Date()]])
                const v = new arrayValidator(s, 'validArray', { minLength: 3, maxLength: 20 }, false, true)
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.an('array');
            })
        })

        describe('Array item types specified at options inputs', function () {

            it('Should be valid with no errors for item tipe with string format', function () {
                const s = JSON.stringify([1, 2])
                const v = new arrayValidator(s, 'validArray', { items: 'number' }, false, true)
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.an('array');
            })

            it('Should be valid with no errors for item tipe with array format', function () {
                const s = JSON.stringify([1, [2]])
                const v = new arrayValidator(s, 'validArray', { items: ['number', 'array'] }, false, true)
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.an('array');
            })

            it('Should be valid with no errors for item tipe with object format', function () {
                const s = JSON.stringify([1, 2])
                const items = {
                    'number': {
                        max: 5
                    },
                    'boolean': {
                    }
                }
                const v = new arrayValidator(s, 'validArray', { items }, false, true)
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.an('array');
            })

        })

    })

    describe('Object operator serialized', function () {

        it('Should be Valid with no errors', function () {
            const s = JSON.stringify({ someValue: 5 })
            const v = new objectValidator(s, 'validObject', {}, false, true)
            expect(v.valid).to.equal(true);
            expect(v.error).to.equal(false);
            expect(v.val).to.be.a('object');
        })

        describe('Object properties types specified', function () {

            it('Should be Valid with no errors for a number property', function () {
                const s = JSON.stringify({ someNumber: 5 })
                const v = new objectValidator(s, 'validObject', { properties: { someNumber: 'number' } }, false, true)
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('object');
            })

            it('Should be Valid with no errors for a string property', function () {
                const s = JSON.stringify({ someString: 'some String' })
                const v = new objectValidator(s, 'validObject', { properties: { someString: 'string' } }, false, true)
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('object');
            })

            it('Should be Valid with no errors for a boolean property', function () {
                const s = JSON.stringify({ someBoolean: true })
                const v = new objectValidator(s, 'validObject', { properties: { someBoolean: 'boolean' } }, false, true)
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('object');
            })

            it('Should be Valid with no errors for a date property', function () {
                const s = JSON.stringify({ someDate: new Date() })
                const v = new objectValidator(s, 'validObject', { properties: { someDate: 'date' } }, false, true)
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('object');
            })

            it('Should be Valid with no errors for a array property', function () {
                const s = JSON.stringify({ someArray: [1, 2, 3] })
                const v = new objectValidator(s, 'validObject', { properties: { someDate: 'array' } }, false, true)
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('object');
            })

            it('Should be Valid with no errors for a object property', function () {
                const s = JSON.stringify({ someObject: { someProperty: 'someValue' } })
                const v = new objectValidator(s, 'validObject', { properties: { someObject: 'object' } }, false, true)
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('object');
            })

        })

        describe('Object properties types specified with options', function () {

            it('Should be Valid with no errors for a number property and max option', function () {
                const s = JSON.stringify({ someNumber: 5 })
                const v = new objectValidator(s, 'validObject', { properties: { someNumber: { type: 'number', max: 10 } } }, false, true)
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('object');
            })

            it('Should be Valid with no errors for a string property and max length option', function () {
                const s = JSON.stringify({ someString: 'some String' })
                const v = new objectValidator(s, 'validObject', { properties: { someString: { type: 'string', maxLength: 25 } } }, false, true)
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('object');
            })

            it('Should be Valid with no errors for a boolean property with type in options', function () {
                const s = JSON.stringify({ someBoolean: true })
                const v = new objectValidator(s, 'validObject', { properties: { someBoolean: { type: 'boolean' } } }, false, true)
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('object');
            })

            it('Should be Valid with no errors for a date property with min option', function () {
                const s = JSON.stringify({ someDate: new Date() })
                const min = new Date()
                min.setDate(min.getDate() - 1)
                const v = new objectValidator(s, 'validObject', { properties: { someDate: { type: 'date', min } } }, false, true)
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('object');
            })

            it('Should be Valid with no errors for a array property with min length', function () {
                const s = JSON.stringify({ someArray: [1, 2, 3] })
                const v = new objectValidator(s, 'validObject', { properties: { someArray: { type: 'array', minLength: 2 } } }, false, true)
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('object');
            })

            it('Should be Valid with no errors for a object property type in options', function () {
                const s = JSON.stringify({ someObject: { someProperty: 'someValue' } })
                const v = new objectValidator(s, 'validObject', { properties: { someObject: { type: 'object' } } }, false, true)
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('object');
            })

        })



        describe('Object properties types specified with nested objects', function () {

            it('Should be Valid with no errors for a object property type in options', function () {
                const s = JSON.stringify({
                    someObject: {
                        someProperty: 'someValue',
                        someNumber: 5,
                        someArray: [1, 2, 3],
                        someDate: new Date(),
                        someNestedObject: {
                            someString: 'some String',
                            someBoolean: true
                        }
                    }
                })
                const v = new objectValidator(s, 'validObject', {
                    properties: {
                        someObject: {
                            type: 'object',
                            properties: {
                                someProperty: 'string',
                                someNumber: 'number',
                                someArray: 'array',
                                someDate: 'date',
                                someNestedObject: {
                                    type: 'object',
                                    properties: {
                                        someString: 'string',
                                        someBoolean: {
                                            type: 'boolean'
                                        }
                                    }
                                }
                            }
                        },
                    }
                }, false, true)
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('object');
            })

        })

    })

    describe('Array operator encoded', function () {

        it('Should be Valid with no errors', function () {
            const s = encodeURIComponent(JSON.stringify([1, 'string', [true]]))
            const v = new arrayValidator(s, 'validArray', {}, true, true)
            expect(v.valid).to.equal(true);
            expect(v.error).to.equal(false);
            expect(v.val).to.be.an('array');
        })

        describe('Array operators options', function () {

            it('Should be valid for a minLength with no errors', function () {
                const s = encodeURIComponent(JSON.stringify([1, 'string', [true]]))
                const v = new arrayValidator(s, 'validArray', { minLength: 2 }, true, true)
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.an('array');
            })

            it('Should be valid for a maxLength with no errors', function () {
                const s = encodeURIComponent(JSON.stringify([1, 'string', [true]]))
                const v = new arrayValidator(s, 'validArray', { maxLength: 20 }, true, true)
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.an('array');
            })

            it('Should be valid for a range length with no errors', function () {
                const s = encodeURIComponent(JSON.stringify([1, 'string', [true, new Date()]]))
                const v = new arrayValidator(s, 'validArray', { minLength: 3, maxLength: 20 }, true, true)
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.an('array');
            })
        })

        describe('Array item types specified at options inputs', function () {

            it('Should be valid with no errors for item tipe with string format', function () {
                const s = encodeURIComponent(JSON.stringify([1, 2]))
                const v = new arrayValidator(s, 'validArray', { items: 'number' }, true, true)
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.an('array');
            })

            it('Should be valid with no errors for item tipe with array format', function () {
                const s = encodeURIComponent(JSON.stringify([1, [2]]))
                const v = new arrayValidator(s, 'validArray', { items: ['number', 'array'] }, true, true)
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.an('array');
            })

            it('Should be valid with no errors for item tipe with object format', function () {
                const s = encodeURIComponent(JSON.stringify([1, 2]))
                const items = {
                    'number': {
                        max: 5
                    },
                    'boolean': {
                    }
                }
                const v = new arrayValidator(s, 'validArray', { items }, true, true)
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.an('array');
            })

        })

    })

    describe('Object operator encoded', function () {

        it('Should be Valid with no errors', function () {
            const s = encodeURIComponent(JSON.stringify({ someValue: 5 }))
            const v = new objectValidator(s, 'validObject', {}, true, true)
            expect(v.valid).to.equal(true);
            expect(v.error).to.equal(false);
            expect(v.val).to.be.a('object');
        })

        describe('Object properties types specified', function () {

            it('Should be Valid with no errors for a number property', function () {
                const s = encodeURIComponent(JSON.stringify({ someNumber: 5 }))
                const v = new objectValidator(s, 'validObject', { properties: { someNumber: 'number' } }, true, true)
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('object');
            })

            it('Should be Valid with no errors for a string property', function () {
                const s = encodeURIComponent(JSON.stringify({ someString: 'some String' }))
                const v = new objectValidator(s, 'validObject', { properties: { someString: 'string' } }, true, true)
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('object');
            })

            it('Should be Valid with no errors for a boolean property', function () {
                const s = encodeURIComponent(JSON.stringify({ someBoolean: true }))
                const v = new objectValidator(s, 'validObject', { properties: { someBoolean: 'boolean' } }, true, true)
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('object');
            })

            it('Should be Valid with no errors for a date property', function () {
                const s = encodeURIComponent(JSON.stringify({ someDate: new Date() }))
                const v = new objectValidator(s, 'validObject', { properties: { someDate: 'date' } }, true, true)
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('object');
            })

            it('Should be Valid with no errors for a array property', function () {
                const s = encodeURIComponent(JSON.stringify({ someArray: [1, 2, 3] }))
                const v = new objectValidator(s, 'validObject', { properties: { someDate: 'array' } }, true, true)
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('object');
            })

            it('Should be Valid with no errors for a object property', function () {
                const s = encodeURIComponent(JSON.stringify({ someObject: { someProperty: 'someValue' } }))
                const v = new objectValidator(s, 'validObject', { properties: { someObject: 'object' } }, true, true)
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('object');
            })

        })

        describe('Object properties types specified with options', function () {

            it('Should be Valid with no errors for a number property and max option', function () {
                const s = encodeURIComponent(JSON.stringify({ someNumber: 5 }))
                const v = new objectValidator(s, 'validObject', { properties: { someNumber: { type: 'number', max: 10 } } }, true, true)
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('object');
            })

            it('Should be Valid with no errors for a string property and max length option', function () {
                const s = encodeURIComponent(JSON.stringify({ someString: 'some String' }))
                const v = new objectValidator(s, 'validObject', { properties: { someString: { type: 'string', maxLength: 25 } } }, true, true)
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('object');
            })

            it('Should be Valid with no errors for a boolean property with type in options', function () {
                const s = encodeURIComponent(JSON.stringify({ someBoolean: true }))
                const v = new objectValidator(s, 'validObject', { properties: { someBoolean: { type: 'boolean' } } }, true, true)
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('object');
            })

            it('Should be Valid with no errors for a date property with min option', function () {
                const s = encodeURIComponent(JSON.stringify({ someDate: new Date() }))
                const min = new Date()
                min.setDate(min.getDate() - 1)
                const v = new objectValidator(s, 'validObject', { properties: { someDate: { type: 'date', min } } }, true, true)
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('object');
            })

            it('Should be Valid with no errors for a array property with min length', function () {
                const s = encodeURIComponent(JSON.stringify({ someArray: [1, 2, 3] }))
                const v = new objectValidator(s, 'validObject', { properties: { someArray: { type: 'array', minLength: 2 } } }, true, true)
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('object');
            })

            it('Should be Valid with no errors for a object property type in options', function () {
                const s = encodeURIComponent(JSON.stringify({ someObject: { someProperty: 'someValue' } }))
                const v = new objectValidator(s, 'validObject', { properties: { someObject: { type: 'object' } } }, true, true)
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('object');
            })

        })



        describe('Object properties types specified with nested objects', function () {

            it('Should be Valid with no errors for a object property type in options', function () {
                const s = encodeURIComponent(JSON.stringify({
                    someObject: {
                        someProperty: 'someValue',
                        someNumber: 5,
                        someArray: [1, 2, 3],
                        someDate: new Date(),
                        someNestedObject: {
                            someString: 'some String',
                            someBoolean: true
                        }
                    }
                }))
                const v = new objectValidator(s, 'validObject', {
                    properties: {
                        someObject: {
                            type: 'object',
                            properties: {
                                someProperty: 'string',
                                someNumber: 'number',
                                someArray: 'array',
                                someDate: 'date',
                                someNestedObject: {
                                    type: 'object',
                                    properties: {
                                        someString: 'string',
                                        someBoolean: {
                                            type: 'boolean'
                                        }
                                    }
                                }
                            }
                        },
                    }
                }, true, true)
                expect(v.valid).to.equal(true);
                expect(v.error).to.equal(false);
                expect(v.val).to.be.a('object');
            })

        })

    })
})
describe('Validation Method', function () {

    describe('Body validator', function () {

        it('Should be valid with no error', function () {
            const body = {
                someProperty: 'someValue',
                someNumber: 5,
                someArray: [1, 2, 3],
                someDate: (new Date()).toISOString(),
                someNestedObject: {
                    someString: 'some String',
                    someBoolean: true
                }
            }
            const schema = {
                someProperty: 'string',
                someNumber: 'number',
                someArray: 'array',
                someDate: 'date',
                someNestedObject: {
                    type: 'object',
                    properties: {
                        someString: 'string',
                        someBoolean: {
                            type: 'boolean'
                        }
                    }
                }
            }
            const v = validate(body, schema, 'body');
            expect(v.error).to.equal(false);
            expect(v.validInput).to.be.a('object');
        })

        it('Should be valid with error by tipe', function () {
            const body = {
                someProperty: 'someValue',
                someNumber: 5,
                someArray: [1, 2, 3],
                someDate: (new Date()).toISOString(),
                someNestedObject: {
                    someString: 'some String',
                    someBoolean: true
                }
            }
            const schema = {
                someProperty: 'string',
                someNumber: 'number',
                someArray: {
                    type: 'array',
                    items: 'boolean'
                },
                someDate: 'date',
                someNestedObject: {
                    type: 'string',
                    properties: {
                        someString: 'string',
                        someBoolean: {
                            type: 'boolean'
                        }
                    }
                }
            }
            const v = validate(body, schema, 'body');
            expect(v.error).to.equal(true);
            expect(v.validInput).to.be.a('object');
        })

        it('Should be valid with error by options', function () {
            const body = {
                someProperty: 'someValue',
                someNumber: 5,
                someArray: [1, 2, 3],
                someDate: (new Date()).toISOString(),
                someNestedObject: {
                    someString: 'some String',
                    someBoolean: true
                }
            }
            const schema = {
                someProperty: 'string',
                someNumber: 'number',
                someArray: {
                    type: 'array',
                    items: 'number',
                    minLength: 10
                },
                someDate: 'date',
                someNestedObject: {
                    type: 'object',
                    properties: {
                        someString: 'string',
                        someBoolean: {
                            type: 'boolean'
                        }
                    }
                }
            }
            const v = validate(body, schema, 'body');
            expect(v.error).to.equal(true);
            expect(v.validInput).to.be.a('object');
        })
    })

    describe('Headers validator', function () {

        it('Should be valid with no error', function () {
            const headers = {
                someProperty: 'someValue',
                someNumber: 5,
                someArray: encodeURIComponent(JSON.stringify([1, 2, 3])),
                someDate: (new Date()).toISOString(),
                someNestedObject: encodeURIComponent(JSON.stringify({
                    someString: 'some String',
                    someBoolean: true
                }))
            }
            const schema = {
                someProperty: 'string',
                someNumber: 'number',
                someArray: 'array',
                someDate: 'date',
                someNestedObject: {
                    type: 'object',
                    properties: {
                        someString: 'string',
                        someBoolean: {
                            type: 'boolean'
                        }
                    }
                }
            }
            const v = validate(headers, schema, 'headers');
            expect(v.error).to.equal(false);
            expect(v.validInput).to.be.a('object');
        })

        it('Should be invalid with no error by tipe', function () {
            const headers = {
                someProperty: 'someValue',
                someNumber: 5,
                someArray: encodeURIComponent(JSON.stringify([1, 2, 3])),
                someDate: (new Date()).toISOString(),
                someNestedObject: encodeURIComponent(JSON.stringify({
                    someString: 'some String',
                    someBoolean: true
                }))
            }
            const schema = {
                someProperty: 'string',
                someNumber: 'array',
                someArray: {
                    type: 'array',
                    items: 'number'
                },
                someDate: 'date',
                someNestedObject: {
                    type: 'object',
                    properties: {
                        someString: 'string',
                        someBoolean: {
                            type: 'boolean'
                        }
                    }
                }
            }
            const v = validate(headers, schema, 'headers');
            expect(v.error).to.equal(false);
            expect(v.valid).to.equal(false);
            expect(v.validInput).to.be.a('object');
        })

        it('Should be valid with error by options', function () {
            const headers = {
                someProperty: 'someValue',
                someNumber: 5,
                someArray: encodeURIComponent(JSON.stringify([1, 2, 3])),
                someDate: (new Date()).toISOString(),
                someNestedObject: encodeURIComponent(JSON.stringify({
                    someString: 'some String',
                    someBoolean: true
                }))
            }
            const schema = {
                someProperty: 'string',
                someNumber: 'number',
                someArray: {
                    type: 'array',
                    items: 'number',
                    minLength: 10
                },
                someDate: 'date',
                someNestedObject: {
                    type: 'object',
                    properties: {
                        someString: 'string',
                        someBoolean: {
                            type: 'boolean'
                        }
                    }
                }
            }
            const v = validate(headers, schema, 'headers');
            expect(v.error).to.equal(true);
            expect(v.validInput).to.be.a('object');
        })
    })

    describe('parameters validator', function () {

        it('Should be valid with no error', function () {
            const parameters = {
                someProperty: 'someValue',
                someNumber: 5,
                someArray: [1, 2, 3],
                someDate: (new Date()).toISOString(),
                someNestedObject: {
                    someString: 'some String',
                    someBoolean: true
                }
            }
            const schema = {
                someProperty: 'string',
                someNumber: 'number',
                someArray: 'array',
                someDate: 'date',
                someNestedObject: {
                    type: 'object',
                    properties: {
                        someString: 'string',
                        someBoolean: {
                            type: 'boolean'
                        }
                    }
                }
            }
            const v = validate(parameters, schema, 'parameters');
            expect(v.error).to.equal(false);
            expect(v.validInput).to.be.a('object');
        })

        it('Should be invalid with no error by tipe', function () {
            const parameters = {
                someProperty: 'someValue',
                someNumber: 5,
                someArray: [1, 2, 3],
                someDate: (new Date()).toISOString(),
                someNestedObject: {
                    someString: 'some String',
                    someBoolean: true
                }
            }
            const schema = {
                someProperty: 'string',
                someNumber: 'array',
                someArray: {
                    type: 'array',
                    items: 'number'
                },
                someDate: 'date',
                someNestedObject: {
                    type: 'object',
                    properties: {
                        someString: 'string',
                        someBoolean: {
                            type: 'boolean'
                        }
                    }
                }
            }
            const v = validate(parameters, schema, 'parameters');
            expect(v.error).to.equal(false);
            expect(v.valid).to.equal(false);
            expect(v.validInput).to.be.a('object');
        })

        it('Should be valid with error by options', function () {
            const parameters = {
                someProperty: 'someValue',
                someNumber: 5,
                someArray: [1, 2, 3],
                someDate: (new Date()).toISOString(),
                someNestedObject: {
                    someString: 'some String',
                    someBoolean: true
                }
            }
            const schema = {
                someProperty: 'string',
                someNumber: 'number',
                someArray: {
                    type: 'array',
                    items: 'number',
                    minLength: 10
                },
                someDate: 'date',
                someNestedObject: {
                    type: 'object',
                    properties: {
                        someString: 'string',
                        someBoolean: {
                            type: 'boolean'
                        }
                    }
                }
            }
            const v = validate(parameters, schema, 'parameters');
            expect(v.error).to.equal(true);
            expect(v.validInput).to.be.a('object');
        })
    })

    describe('query validator', function () {

        it('Should be valid with no error', function () {
            const query = {
                someProperty: 'someValue',
                someNumber: 5,
                someArray: encodeURIComponent(JSON.stringify([1, 2, 3])),
                someDate: (new Date()).toISOString(),
                someNestedObject: encodeURIComponent(JSON.stringify({
                    someString: 'some String',
                    someBoolean: true
                }))
            }
            const schema = {
                someProperty: 'string',
                someNumber: 'number',
                someArray: 'array',
                someDate: 'date',
                someNestedObject: {
                    type: 'object',
                    properties: {
                        someString: 'string',
                        someBoolean: {
                            type: 'boolean'
                        }
                    }
                }
            }
            const v = validate(query, schema, 'query');
            expect(v.error).to.equal(false);
            expect(v.validInput).to.be.a('object');
        })

        it('Should be invalid with no error by tipe', function () {
            const query = {
                someProperty: 'someValue',
                someNumber: 5,
                someArray: encodeURIComponent(JSON.stringify([1, 2, 3])),
                someDate: (new Date()).toISOString(),
                someNestedObject: encodeURIComponent(JSON.stringify({
                    someString: 'some String',
                    someBoolean: true
                }))
            }
            const schema = {
                someProperty: 'string',
                someNumber: 'array',
                someArray: {
                    type: 'array',
                    items: 'number'
                },
                someDate: 'date',
                someNestedObject: {
                    type: 'object',
                    properties: {
                        someString: 'string',
                        someBoolean: {
                            type: 'boolean'
                        }
                    }
                }
            }
            const v = validate(query, schema, 'query');
            expect(v.error).to.equal(false);
            expect(v.valid).to.equal(false);
            expect(v.validInput).to.be.a('object');
        })

        it('Should be valid with error by options', function () {
            const query = {
                someProperty: 'someValue',
                someNumber: 5,
                someArray: encodeURIComponent(JSON.stringify([1, 2, 3])),
                someDate: (new Date()).toISOString(),
                someNestedObject: encodeURIComponent(JSON.stringify({
                    someString: 'some String',
                    someBoolean: true
                }))
            }
            const schema = {
                someProperty: 'string',
                someNumber: 'number',
                someArray: {
                    type: 'array',
                    items: 'number',
                    minLength: 10
                },
                someDate: 'date',
                someNestedObject: {
                    type: 'object',
                    properties: {
                        someString: 'string',
                        someBoolean: {
                            type: 'boolean'
                        }
                    }
                }
            }
            const v = validate(query, schema, 'query');
            expect(v.error).to.equal(true);
            expect(v.validInput).to.be.a('object');
        })
    })
})