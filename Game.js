const Player = require('./Player')
const textResponses = require('./strings')

// console.log(textResponses)

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
        this.gameId = gameId
        this.numPlayers = numPlayers
        this.hasJester = hasJester
        this.hasPlayerQuestions = hasPlayerQuestions
        this.hasPhoneCalls = hasPhoneCalls
        this.discussionTimeLimit = discussionTimeLimit * 1000
        this.eliminationTimeLimit = eliminationTimeLimit * 1000

        this.players = {}
        this.playersLeft = this.numPlayers
        this.gameOver = false
        this.questions = randomShuffle(textResponses.questions)
        this.votes = {}
        this.playersVoted = []
        this.state = 'discussion'
    }

    receiveMessage(number, message, phoneMap, sendMessage) {
        if (Object.keys(this.players).length < this.numPlayers) {
            const [gameId, nickname] = message.split(' ')
            if (gameId === this.gameId) {
                if (nickname in this.players) {
                    sendMessage('Nickname already exists', number)
                    return
                }
                this.votes[nickname] = 0
                this.players[nickname] = new Player(number, sendMessage)
                phoneMap[number] = this.gameId

                this.players[nickname].send('Welcome to a game of Dodgy Diplomats')

                if (Object.keys(this.players).length === this.numPlayers) {
                    for (let id in this.players) {
                        this.players[id].send(`Game starting! the players who have joined are:\n${Object.keys(this.players).join('\n')}`)
                    }

                    const spyId = Math.floor(Math.random() * this.numPlayers)
                    for (let id in this.players) {
                        const player = this.players[id]
                        if (id !== spyId) {
                            player.assignRole('diplomat')
                            player.send(textResponses.roleannouncement[0])
                        } else {
                            player.assignRole('spy')
                            player.send(textResponses.roleannouncement[1])
                        }

                        player.send(`Your role is the ${player.role}`)
                    }
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
                sendMessage('Player does not exist', number)
            }
        } else if (this.state === 'final') {
            if (message in this.players && this.players[message].eliminated) {
                this.votes[message]++
                this.playersVoted.push(number)
                if (this.playersVoted.length >= this.numPlayers - 2) {
                    this.finalElimination()
                }
            } else {
                sendMessage('Player does not exist', number)
            }
        }
    }

    preDiscussion() {
        const question = this.questions.shift()
        for (let id in this.players) {
            const player = this.players[id]
            if (player.role === 'spy') {
                player.send('New round has started spy!')
            } else {
                player.send(question)
            }
        }
        setTimeout(this.discussion, this.discussionTimeLimit)
    }

    discussion() {
        this.state = 'elimination'
        this.preElimination()
    }

    preElimination() {
        for (let id in this.players) {
            this.players[id].send('Cast your vote now!')
        }
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
            for (let id in this.players) {
                const player = this.players[id]
                if (player.role !== 'spy') {
                    player.send(textResponses.endofgame[Math.floor(Math.random() * textResponses.endofgame.length)])
                } else {
                    player.send('Unlucky spy')
                }
            }
            this.gameOver = true
            return
        }

        this.players[eliminatedPlayer].eliminated = true
        this.playersLeft--

        if (this.playersLeft <= 2) {
            this.state = 'final'
            for (let id in this.players) {
                this.players[id].send('There is a final pair left! Eliminated will vote this time')
            }
            setTimeout(this.finalElimination, this.eliminationTimeLimit)
        } else {
            this.state = 'discussion'
            this.preDiscussion()
        }
    }

    finalElimination() {
        if (this.state !== 'final') return
        const eliminatedPlayer = getHighestVote(this.votes)

        for (let id in this.players) {
            const player = this.players[id]
            if (this.players[eliminatedPlayer].role === 'spy') {
                player.send('Diplomats win!')
            } else {
                player.send('Spy wins!')
            }
        }

        this.gameOver = true
    }
}

module.exports = Game
