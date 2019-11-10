const fs = require('fs')

module.exports = {
    getQuestions: function() {
        fullString = fs.readFileSync('strings/questions.txt', 'utf8')
        stringArray = fullString.split('\r\n')
        console.log('STATUS: ' + stringArray.length + ' questions loaded.')
        return stringArray
    }
}
