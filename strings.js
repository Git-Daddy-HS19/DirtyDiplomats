const fs = require('fs')

const files = ['endofgame', 'phasechange', 'questions', 'roleannouncement']

const textResponses = {}
for (let file of files) {
    const fullString = fs.readFileSync(`strings/${file}.txt`, 'utf8')
    textResponses[file] = fullString.split('\n')
    console.log(`STATUS: ${file} loaded.`)
}

module.exports = textResponses
