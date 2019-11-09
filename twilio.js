require('dotenv').config()
const twilio = require('twilio')
var client;

module.exports = {
    config: function() {
        client = new twilio(process.env.accountSid, process.env.authToken);

        console.log("STATUS: Setup complete.");
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