import * as fs from 'fs';

function sum(acc: number, v: number): number {
    return acc+v
}

class Board {
    board: Array<Array<[number, boolean]>>

    constructor(board: string) {
        this.board = board.split('\n').map(row =>
            row.split(' ').filter(item => item.length).map(v =>
             [+v, false]))
    }

    score(): number {
        const unmarked = this.board.map(row => row.filter(item => !item[1]).map(item => item[0]))
        return unmarked.filter(row => row.length).map(row => row.reduce(sum)).reduce(sum)
    }

    won(): boolean {
        const transposed = this.board[0].map((_, col) => this.board.map(row => row[col]))
        const rows = this.board.some(row => row.every(item => item[1]))
        const cols = transposed.some(col => col.every(item => item[1]))

        return rows || cols
    }

    play(value: number) {
        for (const row in this.board) {
            for (const col in this.board[row]) {
                if (this.board[row][col][0] == value) {
                    this.board[row][col][1] = true
                }
            }
        }

    }
}

function play(boards: Array<Board>, drawn: Array<number>): number {
    let num = 0
    for (const i in drawn) {
        num = drawn[i]

        boards.forEach(board => board.play(num))
        if (boards.some(board => board.won())) {
            break
        }
    }

    return num * boards.filter((board) => board.won())[0].score()
}

function playLastWin(boards: Array<Board>, drawn: Array<number>): number {
    let num = 0
    for (const i in drawn) {
        num = drawn[i]

        boards.forEach(board => board.play(num))

        if (boards.length != 1) {
            boards = boards.filter(board => !board.won())
        } else if (boards[0].won()) {
            break
        }
    }

    return num * boards[0].score()
}

const lines = fs.readFileSync('04/input.txt','utf8').trim().split('\n\n')
const drawn = lines[0].split(',').map(Number)
const boards = lines.slice(1).map(board => new Board(board))

console.log('Part 1: '+play(boards, drawn))
console.log('Part 2: '+playLastWin(boards, drawn))
