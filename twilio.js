require('dotenv').config()
const twilio = require('twilio')
const bodyParser = require('body-parser')
const MessagingResponse = twilio.twiml.MessagingResponse
var client

module.exports = (runningGames, phoneMap) => {
    return {
        config: function() {
            // Twilio config
            client = new twilio(process.env.accountSid, process.env.authToken)
            console.log('STATUS: Twilio setup complete.')
        },

        startListener: function(expressObject) {
            expressObject.use(bodyParser.urlencoded({ extended: false }))

            // SMS listener
            expressObject.post('/sms', (req, res) => {
                req.body.Body = req.body.Body.toUpperCase()
                console.log('Message: ' + req.body.Body)
                console.log('Number: ' + req.body.From)
                const twiml = new MessagingResponse()

                res.writeHead(200, { 'Content-Type': 'text/xml' })
                res.end(twiml.toString())

                if (req.body.From in phoneMap) {
                    runningGames[phoneMap[req.body.From]].receiveMessage(req.body.From, req.body.Body, phoneMap, this.sendMessage)
                } else {
                    const [id] = req.body.Body.split(' ')

                    if (id in runningGames) {
                        runningGames[id].receiveMessage(req.body.From, req.body.Body, phoneMap, this.sendMessage)
                    }
                }
            })

            console.log('STATUS: SMS listener enabled.')
        },

        sendMessage: function(text, toNumber) {
            console.log(`Sending ${text} to ${toNumber}`)

            client.messages
                .create({
                    body: text,
                    from: process.env.fromNumber,
                    to: toNumber
                })
                .then(message => console.log(message.sid))
        },

        makeCall: function(toNumber) {
            client.calls.create({
                url: 'https://demo.twilio.com/docs/voice.xml',
                to: toNumber,
                from: process.env.fromNumber
            })
        }
    }
}
