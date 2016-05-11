var expect = require('chai').expect,  
lambdaToTest = require('./index.js')

const context = require('aws-lambda-mock-context')  
const ctx = context()

describe('When Starting a Session', function() {  
    this.timeout(30000)
    var response = null
    var error = null

    var command = encodeURIComponent('<your_slack_command>')
    var token = '<your_slack_command_token>'

    // Fires once for the group of tests, done is mocha's callback to 
    // let it know that an   async operation has completed before running the rest 
    // of the tests, 2000ms is the default timeout though
    before(function(done){
        //This fires the event as if a Lambda call was being sent in
        lambdaToTest.handler({
            payload:
                'token=' + token + '&' +
                'team_id=T0001&' +
                'team_domain=example&' +
                'channel_id=C2147483705&' +
                'channel_name=test&' +
                'user_id=U2147483697&' +
                'user_name=Steve&' +
                'command=' + command + '&' +
                'text=94070&' +
                'response_url=https%3A%2F%2Fhooks.slack.com%2Fcommands%2FT04MMS5RT%2F41686819462%2F5TadytVGnY4Jnrr7jk6vumwF'
            }, ctx, (err, result) => {
                if (err)
                    error = err
                else
                    response = result
                done()
            })
    })


    describe('The response ', function() {
        it('should not have errored',function() {
            expect(error).to.be.null
        })
    })
})