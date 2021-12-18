import * as fs from 'fs';

function str2array(data: string): Array<number|string> {
    return data.split('').map(v => ['[', ']', ','].includes(v) ? v : Number(v))
}

function split(data: Array<string|number>): boolean {
    const index = data.findIndex(v => v > 9)
    if (index < 0) {
        return false
    }
    const insert = ['[', Math.floor((data[index] as number)/2), ',', Math.ceil((data[index] as number)/2), ']']
    data.splice(index, 1, ...insert)
    return true
}

function explode(data: Array<string|number>): boolean {
    let depth = 0
    let pos = 0
    while (depth != 5 && pos < data.length) {
        if (data[pos] == '[') {
            depth++
        } else if (data[pos] == ']') {
            depth--
        }
        pos++
    }
    if (depth != 5) {
        return false
    }

    for (let i = pos - 2; i >= 0; i--) {
        if (typeof data[i] === "number") {
            (data[i] as number) += data[pos] as number
            break
        }
    }
    for (let i = pos + 4; i < data.length; i++) {
        if (typeof data[i] === "number") {
            (data[i] as number) += data[pos+2] as number
            break
        }
    }

    data.splice(pos-1, 5, 0)
    return true
}

function reduce(number: string): string {
    const data = str2array(number)

    let changed = true
    while (changed) {
        while (explode(data)) {}
        changed = split(data)
    }
    return data.join('')
}

function sum(a: string, b: string): string {
    return reduce(`[${a},${b}]`)
}

function magnitude(data: Array<number|string>): number{
    if (data.length == 1) {
        return data[0] as number
    }

    let depth = 0
    let commaPos = -1
    for (const i in data.slice(0)) {
        switch (data[i]) {
            case '[':
                depth++
                break
            case ']':
                depth--
                break;
            case ',': {
                if (depth == 1) {
                    commaPos = +i
                }
                break
            }
        }
    }
    const left = magnitude(data.slice(1, commaPos))
    const right = magnitude(data.slice(commaPos+1, -1))
    return left*3 + right*2
}

const numbers = fs.readFileSync('18/input.txt', 'utf8').trim().split('\n')
const result = numbers.reduce((a, v) => sum(a, v))

console.log("Part 1: " + magnitude(str2array(result)))

let max = 0
numbers.forEach(a => {
    numbers.filter(v => v != a).forEach(b => {
        const mag = magnitude(str2array(sum(a, b)))
        if (mag > max) {
            max = mag
        }
    })
})

console.log("Part 2: " + max)
