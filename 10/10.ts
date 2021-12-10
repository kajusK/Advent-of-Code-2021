import * as fs from 'fs';
import { stringify } from 'querystring';

const closing = new Map<string, string>([
    ['(', ')'],
    ['[', ']'],
    ['<', '>'],
    ['{', '}'],
])

function corruptedScore(line: Array<string>): number {
    const stack = Array<string>()
    const score = new Map<string, number>([
        [')', 3],
        [']', 57],
        ['}', 1197],
        ['>', 25137]
    ])

    for (const c of line) {
        const bracket = closing.get(c)
        if (bracket !== undefined) {
            stack.push(bracket)
        } else if (stack.pop() != c) {
            return score.get(c) as number
        }
    }
    return 0
}

function repairScore(line: Array<string>): number {
    const stack = Array<string>()
    const score = new Map<string, number>([
        [')', 1],
        [']', 2],
        ['}', 3],
        ['>', 4]
    ])

    for (const c of line) {
        const bracket = closing.get(c)
        if (bracket !== undefined) {
            stack.push(bracket)
        } else {
            stack.pop()
        }
    }

    return stack.reverse().map(v => score.get(v) as number).reduce((a, v) => a*5 + v)
}

const input = fs.readFileSync('10/input.txt', 'utf8').trim().split('\n').map(v => Array.from(v))
const scores = input.map(v => corruptedScore(v))
console.log("Part 1: "+scores.reduce((a, v) => a + v))

const incomplete = input.filter(v => corruptedScore(v) == 0)
const repairs = incomplete.map(v => repairScore(v)).sort((a, b) => a-b)
console.log("Part 2: "+repairs[Math.floor(repairs.length/2)])
