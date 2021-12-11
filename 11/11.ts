import * as fs from 'fs';

class Map {
    map: Array<Array<number>>
    flashes = 0
    round = 0

    constructor(input: string) {
        this.map = input.split('\n').map(v => Array.from(v).map(Number))
    }

    getAdjacent(x: number, y: number): Array<Array<number>> {
        const adjacent = Array<Array<number>>()

        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const px = x + dx
                const py = y + dy
                if (px >= 0 && px < this.map[0].length && py >= 0 && py < this.map.length) {
                    adjacent.push([px, py])
                }
            }
        }
        return adjacent
    }

    flash(x: number, y: number) {
        this.map[y][x] = -1
        this.flashes++

        this.getAdjacent(x, y).forEach(([px, py]) => {
            if (this.map[py][px] >= 0) {
                this.map[py][px]++
            }
            if (this.map[py][px] > 9) {
                this.flash(px, py)
            }
        })
    }

    runRound() {
        this.map = this.map.map(row => row.map(v => v + 1))

        this.map.forEach((row, y) => row.forEach((v, x) => {
            if (v > 9) {
                this.flash(x, y)
            }
        }))
        this.map = this.map.map(row => row.map(v => v < 0 ? 0 : v))
        this.round++
    }

    isAllZero(): boolean {
        return this.map.every(row => row.every(v => v == 0))
    }
}


const map = new Map(fs.readFileSync('11/input.txt', 'utf8').trim())

for (let i = 0; i < 100; i++) {
    map.runRound()
}
console.log("Part 1: "+map.flashes)

while (!map.isAllZero()) {
    map.runRound()
}
console.log("Part 2: "+map.round)
