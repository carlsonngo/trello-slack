process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT']

// var Trello = require('node-trello')
var _ = require('lodash')
var http = require('superagent')

exports.handler = (event, context, callback) => {
  const slackCommand = '<your_slack_command>'
  const slackToken = '<your_slack_command_token>'
  const trelloKey = '<your_trello_key>'
  const trelloToken = '<your_trello_token>'

  var listId = '<your_trello_destination_list_id>'

  var body = event.payload

  if (!body) {
    callback("Failed to parse message.")
    return
  } else {
    body = _.chain(body.split('&'))
      .map((kv) => {
        var s = kv.split('=')
        return _.set({}, s[0], s[1])
      })
      .reduce((result, kv) => _.assign(result, kv), {})
      .value()
  }

  console.log("request: " + JSON.stringify(body))


  var command = decodeURIComponent(body.command)
  var successMsg = 'We have heard you, thanks!'
  if (command === slackCommand) {
    if (body.token !== slackToken) {
      callback("Invalid slack token.")
      return
    }
  }

  if (!listId) {
    callback("Invalid command.")
    return
  }


  var params = {
    name: decodeURIComponent(body.text.replace(/\+/g, '%20')),
    desc: 'Reported by: ' + _.capitalize(body.user_name),
    due: null
  }

  console.log('creating trello card in list (' + listId + ') with params: ' + JSON.stringify(params))

  http.post('https://api.trello.com/1/lists/' + listId + '/cards?key=' + trelloKey + '&token=' + trelloToken)
    .send(params)
    .set('Accept', 'application/json')
    .end((err, res) => {
      if (err) {
        console.log('error')
        callback(err)
      } else {
        console.log(res.body)
        callback(null, successMsg)
      }
    })
}