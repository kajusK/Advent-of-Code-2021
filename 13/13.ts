import * as fs from 'fs';

function fold(dots: Array<Array<number>>, dir: Array<string>): Array<Array<number>> {
    const result = new Set<string>()
    const foldPos = Number(dir[1])

    dots.map(dot => {
        if (dir[0] == 'x' && dot[0] > foldPos) {
            return [2*foldPos - dot[0], dot[1]]
        } else if (dir[0] == 'y' && dot[1] > foldPos) {
            return [dot[0], 2*foldPos - dot[1]]
        } else {
            return dot
        }
    }).forEach(dot => result.add(JSON.stringify(dot)))

    return Array.from(result.values()).map(v => JSON.parse(v))
}

function printMap(dots: Array<Array<number>>) {
    const max_x = dots.map(v => v[0]).reduce((a, v) => a < v ? v : a) + 1
    const max_y = dots.map(v => v[1]).reduce((a, v) => a < v ? v : a) + 1
    const map = Array(max_y).fill(undefined).map(() => Array(max_x).fill(' '))

    for (const dot of dots) {
        map[dot[1]][dot[0]] = '#'
    }
    for (const row of map) {
        console.log(row.join(''))
    }
}

const [positions, folding] = fs.readFileSync('13/input.txt', 'utf8').trim().split('\n\n')
let dots = positions.split('\n').map(v => v.split(',').map(Number))
const folds = folding.split('\n').map(v => v.replace('fold along ', '').split('='))

dots = fold(dots, folds[0])
console.log("Part 1:" +dots.length)

folds.slice(1).forEach(f => {dots = fold(dots, f)})
console.log("Part 2:")
console.log("-----------------")
printMap(dots)
