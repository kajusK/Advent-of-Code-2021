import * as fs from 'fs';

const remaining = new Map<number,number>()

function life(daysLeft: number, init = 8): number {
    if (init == 8 && remaining.has(daysLeft)) {
        return remaining.get(daysLeft) as number
    }

    let fishCnt = 1
    for (let days = daysLeft - init - 1; days >= 0; days -= 7) {
        const born = life(days)
        remaining.set(days, born)
        fishCnt += born
    }
    return fishCnt
}

const fish = fs.readFileSync('06/input.txt','utf8').trim().split(',').map(Number)
console.log("Part 1: " +fish.map(v => life(80, v)).reduce((a, v) => a+v))
console.log("Part 1: " +fish.map(v => life(256, v)).reduce((a, v) => a+v))
