import * as fs from 'fs';

/**
 * Calculate submarine position
 *
 * forward changes horizontal position, up/down vertical
 *
 * @param lines Array of inputs [direction, distance]
 * @returns horizontal * vertical position
 */
function part1(lines: Array<Array<string>>): number {
    let horizontal = 0
    let vertical = 0
    for (let i in lines) {
        const value = +lines[i][1]

        switch (lines[i][0]) {
            case 'forward':
                horizontal += value
                break

            case 'down':
                vertical += value
                break

            case 'up':
                vertical -= value
                break
        }
    }
    return horizontal*vertical
}

/**
 * Calculate submarine position
 *
 * forward changes horizontal and vertical position, up/down aim
 *
 * @param lines Array of inputs [direction, distance]
 * @returns horizontal * vertical position
 */
function part2(lines: Array<Array<string>>): number {
    let horizontal = 0
    let vertical = 0
    let aim = 0

    for (const i in lines) {
        const value = +lines[i][1]

        switch (lines[i][0]) {
            case 'forward':
                horizontal += value
                vertical += aim * value
                break

            case 'down':
                aim += value
                break

            case 'up':
                aim -= value
                break
        }
    }
    return horizontal*vertical
}

const lines = fs.readFileSync('02/input.txt','utf8').split("\n").map((item) => item.split(' '));
console.log("Part 1: "+part1(lines))
console.log("Part 2: "+part2(lines))
