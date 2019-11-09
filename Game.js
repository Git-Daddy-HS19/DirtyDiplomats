class Game {
    constructor(gameId, numPlayers, hasJester, hasPlayerQuestions, hasPhoneCalls, discussionTimeLimit, eliminationTimeLimit) {
        this.gameID = gameId
        this.numPlayers = numPlayers
        this.hasJester = hasJester
        this.hasPlayerQuestions = hasPlayerQuestions
        this.hasPhoneCalls = hasPhoneCalls
        this.discussionTimeLimit = discussionTimeLimit
        this.eliminationTimeLimit = eliminationTimeLimit
    }
}

module.exports = Game
