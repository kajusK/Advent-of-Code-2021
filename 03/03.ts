import * as fs from 'fs';

/**
 * Get most common bits from multiple binary numbers
 *
 * @param lines Parsed input binary numbers
 * @returns 1 if there are more 1 than 0 in given bit, else 0
 */
function mostCommon(lines: Array<Array<number>>): Array<string> {
    const counts = lines.reduce((a, num) =>
        a.map((sum, i) => sum + num[i])
    )
    return counts.map((v) => v >= lines.length/2 ? '1' : '0')
}

/**
 * Reduce list of numbers to a single number by the most/least common
 * value among corresponding bit (bit changes every iteration) in numbers.
 *
 * @param lines Parsed input binary numbers
 * @param compare Comparsion function between input bits and most common bits
 * @returns Last remaining value
 */
function reduceLines(
         lines: Array<Array<number>>,
         compare: (a: number, b: number) => boolean): number {
    let input = lines
    let bit = 0

    while (input.length != 1) {
        const value = mostCommon(input)
        input = input.filter((v) => compare(v[bit], +value[bit]))
        bit++
    }
    return parseInt(input[0].join(''), 2)
}

/**
 * Power consumption is obtained by multiplying the number consisting
 * of most common bits in input and least common bits
 *
 * @param lines Parsed input binary numbers
 * @returns power consumption
 */
function calculatePower(lines: Array<Array<number>>): number {
    const common = mostCommon(lines)

    const gamma = common.join('')
    const epsilon = common.map((v) => v == '0' ? '1' : '0').join('')
    return parseInt(gamma, 2)*parseInt(epsilon, 2)
}

function oxygenRating(lines: Array<Array<number>>): number {
    return reduceLines(lines, (a, b) => a == b)
}

function scrubberRating(lines: Array<Array<number>>): number {
    return reduceLines(lines, (a, b) => a != b)
}

const lines = fs.readFileSync('03/input.txt','utf8').split("\n").filter(
    (val) => val.trim().length != 0).map((val) => val.split('').map(Number));
console.log("Part 1: "+calculatePower(lines))
console.log("Part 2: "+scrubberRating(lines)*oxygenRating(lines))
