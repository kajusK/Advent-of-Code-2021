import * as fs from 'fs';

function leastFuel(crabs: Array<number>, getFuel: (dist: number) => number): number {
    const max = Math.max(...crabs)
    const fuels: Array<number> = []
    for (let i = 0; i < max; i++) {
        fuels.push(crabs.map(v => getFuel(Math.abs(v - i))).reduce((a, v) => a + v))
    }
    return Math.min(...fuels)
}

const crabs = fs.readFileSync('07/input.txt','utf8').trim().split(',').map(Number)
console.log("Part 1: " +leastFuel(crabs, dist => dist))
console.log("Part 2: " +leastFuel(crabs, dist => (1+dist)/2*dist))
