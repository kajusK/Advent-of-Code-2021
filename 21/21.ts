interface Player {
    score: number,
    position: number
}

function move(player: Player, steps: number): Player {
    let pos = (player.position + steps) % 10
    pos = pos == 0 ? 10 : pos
    return {score: player.score + pos, position: pos}
}

function part1(current: Player, second: Player, dice: number): number {
    if (second.score >= 1000) {
        return current.score * dice
    }

    let roll = 0
    for (let i = 0; i < 3; i++) {
        roll += ++dice
    }

    return part1(second, move(current, roll), dice)
}

const map = new Map<string, Array<number>>()
const diracRolls = [3, 4, 5, 6, 7, 8, 9]
const diracCount = [1, 3, 6, 7, 6, 3, 1]

function part2(current: Player, second: Player): Array<number> {
    if (second.score >= 21) {
        return [0, 1]
    }
    const key = JSON.stringify([current, second])
    if (map.has(key)) {
        return map.get(key)!
    }

    const wins = [0, 0]
    diracRolls.forEach(roll => {
        const result = part2(second, move(current, roll)).map(v => v*diracCount[roll-3])
        wins[0] += result[1]
        wins[1] += result[0]
    })
    map.set(key, wins)
    return wins
}

const player1: Player = {score: 0, position: 8}
const player2: Player = {score: 0, position: 3}
console.log("Part 1: " + part1(player1, player2, 0))
console.log("Part 2: " + Math.max(...part2(player1, player2)))
