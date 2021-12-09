import * as fs from 'fs';

class Map {
    map: Array<Array<number>>
    dirs = [
        [-1, 0],
        [0, -1],
        [1, 0],
        [0, 1]
    ]

    constructor(input: string) {
        this.map = input.split('\n').map(v => Array.from(v).map(Number))
    }

    getAdjacent(x: number, y: number): Array<Array<number>> {
        return this.dirs.map(([dx, dy]) => [x+dx, y+dy]).filter(([px, py]) =>
            px >= 0 && px < this.map[0].length && py >= 0 && py < this.map.length)
    }

    isLowest(x: number, y: number): boolean {
        return this.getAdjacent(x, y).every(([px, py]) => this.map[py][px] > this.map[y][x])
    }

    part1(): number {
        let result = 0
        for (let x = 0; x < this.map[0].length; x++) {
            for (let y = 0; y < this.map.length; y++) {
                if (this.isLowest(x, y)) {
                    result += this.map[y][x] + 1
                }
            }
        }
        return result
    }

    part2(): number {
        const basins = Array<number>()

        for (let x = 0; x < this.map[0].length; x++) {
            for (let y = 0; y < this.map.length; y++) {
                if (this.map[y][x] >= 9) {
                    continue
                }

                const stack = Array<Array<number>>()
                stack.push([x, y])
                let basin = 0

                while (stack.length) {
                    const [px, py] = stack.pop() as Array<number>
                    if (this.map[py][px] >= 9) {
                        continue
                    }

                    this.map[py][px] = 10
                    this.getAdjacent(px, py).forEach(v => stack.push(v))
                    basin++
                }
                basins.push(basin)
            }
        }
        return basins.sort((a, b) => b-a).slice(0, 3).reduce((a, b) => a*b)
    }
}

const map = new Map(fs.readFileSync('09/input.txt', 'utf8').trim())
console.log("Part 1: " + map.part1())
console.log("Part 1: " + map.part2())
