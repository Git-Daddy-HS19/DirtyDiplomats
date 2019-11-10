const Player = require('./Player')

randomShuffle = arr => {
    const newArr = [...arr]
    for (let i = newArr.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * i)
        const temp = newArr[i]
        newArr[i] = newArr[j]
        newArr[j] = temp
    }
    return newArr
}

getHighestVote = votes => {
    let highestVotes = []
    let highestVote = -1
    for (let vote in votes) {
        if (votes[vote] > highestVote) {
            highestVotes = [vote]
        } else if (votes[vote] === highestVote) {
            highestVotes.push(vote)
        }
    }
    return highestVotes[Math.floor(Math.random() * highestVotes.length)]
}

class Game {
    constructor(gameId, numPlayers, hasJester, hasPlayerQuestions, hasPhoneCalls, discussionTimeLimit, eliminationTimeLimit) {
        this.gameID = gameId
        this.numPlayers = numPlayers
        this.hasJester = hasJester
        this.hasPlayerQuestions = hasPlayerQuestions
        this.hasPhoneCalls = hasPhoneCalls
        this.discussionTimeLimit = discussionTimeLimit * 1000
        this.eliminationTimeLimit = eliminationTimeLimit * 1000

        this.players = {}
        this.playersLeft = this.numPlayers
        this.gameOver = false
        this.questions = randomShuffle(strings)
        this.votes = {}
        this.playersVoted = []
        this.state = 'discussion'
    }

    receiveMessage(number, message) {
        if (this.players.length < this.numPlayers) {
            const [gameId, nickname] = message.split(' ')
            if (gameId === this.gameId) {
                if (nickname in this.players) {
                    // player already exists
                    // Send a message saying so
                    return
                }
                this.votes[nickname] = 0
                this.players[nickname] = new Player(number)
                // Send welcome message
                if (this.players.length === this.numPlayers) {
                    const spyId = Math.floor(Math.random() * this.players.length)
                    this.players.forEach((player, id) => {
                        player.assignRole(id === spyId ? 'spy' : 'diplomat')
                        // Send text to players confirming their roles
                    })
                    this.preDiscussion()
                }
            }
            return
        }

        if (number in this.playersVoted) return

        if (this.state === 'elimination') {
            if (message in this.players && !this.players[message].eliminated) {
                this.votes[message]++
                this.playersVoted.push(number)

                if (this.playersVoted.length === this.playersLeft) {
                    this.elimination()
                }
            } else {
                // Player doesn't exist
            }
        } else if (this.state === 'final') {
            if (message in this.players && this.players[message].eliminated) {
                this.votes[message]++
                this.playersVoted.push(number)
                if (this.playersVoted.length >= this.numPlayers - 2) {
                    this.finalElimination()
                }
            } else {
                // Player doesn't exist
            }
        }
    }

    preDicussion() {
        // Send question to everyone but the spy, however the spy gets told that the round has started
        setTimeout(this.discussion, this.discussionTimeLimit)
    }

    discussion() {
        this.state = 'elimination'
        this.preElimination()
    }

    preElimination() {
        // Send message saying cast your votes
        setTimeout(this.elimination, this.eliminationTimeLimit)
    }

    elimination() {
        if (this.state !== 'elimination') return
        const eliminatedPlayer = getHighestVote(this.votes)

        for (let player in this.players) {
            this.votes[player] = 0
        }
        this.playersVoted = []

        if (this.players[eliminatedPlayer].role === 'spy') {
            // Diplomats win, send message notifying everyone
            this.gameOver = true
            return
        }
        this.players[eliminatedPlayer].eliminated = true
        this.playersLeft--

        if (this.playersLeft <= 2) {
            this.state = 'final'
            // Send the dead the final round vote and the 2 remaining players a msg notifying them
            setTimeout(this.finalElimination, this.eliminationTimeLimit)
        } else {
            this.state = 'discussion'
            this.preDiscussion()
        }
    }

    finalElimination() {
        if (this.state !== 'final') return
        const eliminatedPlayer = getHighestVote(this.votes)

        if (this.players[eliminatedPlayer].role === 'spy') {
            // diplomats win
        } else {
            // spy wins
        }

        this.gameOver = true
    }
}

module.exports = Game
