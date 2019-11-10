class Player {
    constructor(number) {
        this.number = number
        this.eliminated = false
    }

    assignRole(role) {
        this.role = role
    }
}

module.exports = Player
