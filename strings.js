const fs = require('fs')

module.exports = {
    getQuestions: function() {
        fullString = fs.readFileSync('questions.txt', 'utf8')
        return fullString.split("\r\n")
    }
};