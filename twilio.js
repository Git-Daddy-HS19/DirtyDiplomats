require('dotenv').config()
const twilio = require('twilio')
const express = require('express')
const messagingResponse = twilio.twiml.MessagingResponse
var client;


module.exports = {
    config: function() {
        client = new twilio(process.env.accountSid, process.env.authToken);
        
        console.log("STATUS: Twilio setup complete.");

        // Set up express on port 3000
        const port = 3000
        const app = express()

        // SMS listener
        app.post('/sms', (req, res) => {
            console.log(req)
            // const twiml = new MessagingResponse()

            messagingResponse.message("asdf")
            res.writeHead(200, {'Content-Type': 'text/xml'});
            res.end(twiml.toString());
        })

        // Web GUI
        app.post('/create-game', (req, res) => {
            console.log(req)
            let newGameID
            while (runningGames[(newGameID = genUniqueID())] !== undefined) {}
            runningGames[newGameID] = new Game()
            res.json({ id: newGameID })
        })

        app.use(express.static('public'))
        app.listen(port, () => console.log(`STATUS: Web server and SMS listener active on port ${port}!`))




    },

    sendMessage: function(text, toNumber) {
        client.messages.create({
            body: text,
            from: process.env.fromNumber,
            to: toNumber
        })
        .then((message) => console.log(message.sid));
    },

    receiveMessage: function() {
        
    }

};