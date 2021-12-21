class DeterministicDice {
    number = 0

    roll(times: number): number {
        let sum = 0
        for (let i = 0; i < times; i++) {
            sum += ++this.number
        }
        return sum
    }
}

class Game {
    score1 = 0
    score2 = 0
    player1: number
    player2: number
    dice = new DeterministicDice()

    constructor(pos1: number, pos2: number) {
        this.player1 = pos1
        this.player2 = pos2
    }

    private move(pos: number): number {
        pos += this.dice.roll(3)
        pos %= 10
        return pos == 0 ? 10 : pos
    }

    round(winScore: number): boolean {
        this.player1 = this.move(this.player1)
        this.score1 += this.player1
        if (this.score1 >= winScore) {
            return true
        }
        this.player2 = this.move(this.player2)
        this.score2 += this.player2
        if (this.score2 >= winScore) {
            return true
        }
        return false
    }

    score(): number {
        const score = this.score1 > this.score2 ? this.score2 : this.score1
        return score*this.dice.number
    }
}

const game = new Game(8, 3)
while (!game.round(1000)) {}

console.log("Part 1: "+game.score())
