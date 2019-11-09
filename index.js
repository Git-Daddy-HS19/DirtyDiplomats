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

app.listen(port, () => console.log(`STATUS: Example app listening on port ${port}!`))
