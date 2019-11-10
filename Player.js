class Player {
    constructor(number, sendMessage) {
        this.number = number
        this.sendMessage = sendMessage
        this.eliminated = false
    }

    assignRole(role) {
        this.role = role
    }

    send(msg) {
        this.sendMessage(msg, this.number)
    }
}

module.exports = Player
