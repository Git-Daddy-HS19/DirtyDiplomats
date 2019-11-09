// Includes here
const express = require('express')
const twilio = require('./twilio')
const strings = require('./strings')

// Configure Twilio (and soon also express)
twilio.config()

// Read questions from file
questions = strings.getQuestions()

// Generates game ID
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


