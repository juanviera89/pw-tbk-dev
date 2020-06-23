const expect = require('chai').expect;
const fakeCognito = require('./')

describe('Fake Cognito', function () {
    let someToken
    let someUser
    before(async function () {
        someToken = fakeCognito.maketoken()
        someUser = await fakeCognito.cognito.getUser({ AccessToken: someToken }).promise()
    })

    it('Should return a user object for any string as token', async function () {
        const someOtherUser = await fakeCognito.cognito.getUser({ AccessToken: 'someToken' }).promise()
        expect(someOtherUser).to.be.a('object');
        expect(someOtherUser.Username).to.be.a('string');
        
    })

    it(`Should return user prefetchend username for prefetchend token`, async function () {
        const retrievedUser = await fakeCognito.cognito.getUser({ AccessToken: someToken }).promise()
        expect(retrievedUser.Username).to.equal(someUser.Username);
        
    })

    it(`Should return an object with an array of user with length at least one `, async function () {
        const retrievedUser = await fakeCognito.cognito.listUsers({ Filter : 'email="juan_viera22@hotmail.com"' }).promise()
        expect(retrievedUser.Users.length).to.not.equal(0);
        
    })

    it('Should throw error for token "UserNotAuthenticated2020"', async function () {
        let error = undefined
        let someOtherUser = undefined
        try {
            someOtherUser = await fakeCognito.cognito.getUser({ AccessToken: 'UserNotAuthenticated2020' }).promise()
        } catch (err) {
            error = err
        }
        expect(someOtherUser).to.equal(undefined);
        expect(error).to.be.an('error');
        
    })
})