// Includes here
const express = require('express')
const twilio = require('./twilio')
const strings = require('./strings')

// Configure twilio
twilio.config()

// Read questions from file
questions = strings.getQuestions()

// Webserver stuff?
const app = express()
const port = 3000
app.use(express.static('public'))

const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const genUniqueID = (length = 4) => {
    let id = ''
    for (let i = 0; i < length; i++) {
        id += charSet[Math.floor(Math.random() * charSet.length)]
    }
    return id
}

const Game = require('./Game.js')
const runningGames = {}

app.post('/create-game', (req, res) => {
    console.log(req)
    let newGameID
    while (runningGames[(newGameID = genUniqueID())] !== undefined) {}
    runningGames[newGameID] = new Game()
    res.json({ id: newGameID })
})

app.listen(port, () => console.log(`STATUS: Example app listening on port ${port}!`))

// Define game class

// class Game()