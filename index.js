const express = require('express')
const twilio = require('twilio')
require('dotenv').config()

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

const runningGames = {}

app.post('/create-game', (req, res) => {
    let newGameID
    while (runningGames[(newGameID = genUniqueID())] === undefined) {}
    runningGames[newGameID] = {}
    res.json({ id: newGameID })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
