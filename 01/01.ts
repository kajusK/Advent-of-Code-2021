import * as fs from 'fs';

/**
 * Count incremented readings
 *
 * @param lines Array of sonar readings
 * @returns Amount of reading with value bigger than previous one
 */
function countIncrements(lines: Array<number>): number {
    return lines.filter((element, index, array) => element > array[index-1]).length
}

/**
 * Averages sonar readings by sliding window
 *
 * @param lines Array of sonar readings
 * @param win_len Lenght of the sliding window
 * @returns Averaged sonar readings
 */
function sliding(lines: Array<number>, win_len: number): Array<number> {
    const output: Array<number> = []

    for (let i = 0; i < lines.length-win_len; i++) {
        output.push(lines.slice(i,i+win_len).reduce((a, b) => a+b))
    }
    return output
}

const lines = fs.readFileSync('01/input.txt','utf8').split("\n").map((item) => parseInt(item));
console.log('Part1:'+countIncrements(lines))
console.log('Part2:'+countIncrements(sliding(lines, 3)))
