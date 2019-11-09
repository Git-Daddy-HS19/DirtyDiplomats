const express = require('express')
const twilio = require('twilio')
require('dotenv').config()

const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const genUniqueID = (length = 4) => {
    let id = ''
    for (let i = 0; i < length; i++) {
        id += charSet[Math.floor(Math.random() * charSet.length)]
    }
    return id
}

const app = express()
const port = 3000

app.use(express.static('public'))

app.post('/create-game', (req, res) => {
    res.json({ id: genUniqueID() })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
