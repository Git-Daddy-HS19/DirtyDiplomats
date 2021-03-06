// Globals
const runningGames = {}
const phoneMap = {}
const bodyParser = require('body-parser')
require('dotenv').config()

// Includes
const express = require('express')
const twilio = require('./twilio')(runningGames, phoneMap)
const textResponses = require('./strings')
const Game = require('./Game')

const port = 3000
const app = express()

// Configure Twilio (and soon also express)
twilio.config()
twilio.startListener(app)

// Read questions from file

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

// Web GUI
app.post('/create-game', (req, res) => {
    console.log(req.body)
    console.log(req.params)
    let gameId
    while (runningGames[(gameId = genUniqueID())] !== undefined) {}
    runningGames[gameId] = new Game(
        gameId,
        +req.body.numPlayers,
        req.body.hasJester === 'on',
        req.body.hasPlayerQuestions === 'on',
        req.body.hasPhoneCalls === 'on',
        +req.body.discussionTimeLimit,
        +req.body.eliminationTimeLimit
    )

    res.json({ id: gameId })
})

// Generates game ID
const charSet = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789'
const genUniqueID = (length = 4) => {
    let id = ''
    for (let i = 0; i < length; i++) {
        id += charSet[Math.floor(Math.random() * charSet.length)]
    }
    return id
}

setTimeout(() => {
    for (let id in runningGames) {
        if (runningGames[id].gameOver) {
            for (let player in runningGames[id].players) {
                let number = runningGames[id].players[player].number
                delete phoneMap[number]
            }
            delete runningGames[id]
        }
    }
}, 30000)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
