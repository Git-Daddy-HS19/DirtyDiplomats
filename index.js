// Includes
const express = require('express')
const twilio = require('./twilio')
const strings = require('./strings')
const Game = require('./game.js')

// Globals
const runningGames = {}

const port = 3000
const app = express()

// Configure Twilio (and soon also express)
twilio.config()
twilio.startListener(app)

// Read questions from file
questions = strings.getQuestions()

// Web GUI
app.post('/create-game', (req, res) => {
    console.log(req)
    let newGameID
    while (runningGames[(newGameID = genUniqueID())] !== undefined) {}
    runningGames[newGameID] = new Game()
    res.json({ id: newGameID })
})

// Generates game ID
const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const genUniqueID = (length = 4) => {
    let id = ''
    for (let i = 0; i < length; i++) {
        id += charSet[Math.floor(Math.random() * charSet.length)]
    }
    return id
}

app.use(express.static('public'))
app.listen(port, () => console.log(`STATUS: Web server active on port ${port}!`))
