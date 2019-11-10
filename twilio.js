require('dotenv').config()
const twilio = require('twilio')
const bodyParser = require('body-parser')
const MessagingResponse = twilio.twiml.MessagingResponse
var client;


module.exports = {
    config: function() {
        // Twilio config
        client = new twilio(process.env.accountSid, process.env.authToken);
        console.log("STATUS: Twilio setup complete.");
    },

    startListener: function(expressObject) {
        expressObject.use(bodyParser.urlencoded({ extended: false }));
        
        // SMS listener
        expressObject.post('/sms', (req, res) => {

            console.log("Message: " + req.body.Body + " " + req.body.From)
            const twiml = new MessagingResponse()

            twiml.message("asdf")
            res.writeHead(200, {'Content-Type': 'text/xml'});
            res.end(twiml.toString());
        })

        console.log("Status: SMS listener enabled.")
    },

    sendMessage: function(text, toNumber) {
        client.messages.create({
            body: text,
            from: process.env.fromNumber,
            to: toNumber
        })
        .then((message) => console.log(message.sid));
    }
};