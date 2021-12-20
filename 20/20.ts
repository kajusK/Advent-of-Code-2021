import * as fs from 'fs';

function extendImage(image: Array<Array<string>>, c: string): Array<Array<string>> {
    const result = Array<Array<string>>()
    for (let i = 0; i < 3; i++) {
        result.push(Array(image[0].length+6).fill(c))
    }
    for (const row of image) {
        result.push([c, c, c].concat(row).concat([c, c, c]))
    }
    for (let i = 0; i < 3; i++) {
        result.push(Array(image[0].length+6).fill(c))
    }

    return result
}

function cutCorners(image: Array<Array<string>>): Array<Array<string>> {
    return image.slice(1, image.length-1).map(row => row.slice(1, row.length -1))
}

function printImage(image: Array<Array<string>>) {
    for (const row of image) {
        console.log(row.join(''))
    }
    console.log('')
}

function enhance(image: Array<Array<string>>, lookup: Array<string>): Array<Array<string>> {
    const result = Array<Array<string>>()

    for (let y = 1; y < image.length - 1; y++) {
        const row = Array<string>()
        for (let x = 1; x < image[0].length - 1; x++) {
            let number = Array<string>()
            for (let i = 0; i < 3; i++) {
                number = number.concat(image[y+i-1].slice(x-1, x+2))
            }
            const index = parseInt(number.map(v => v == '#' ? '1' : '0').join(''), 2)
            row.push(lookup[index])
        }
        result.push(row)
    }
    return cutCorners(result)
}

function run(image: Array<Array<string>>, lookup: Array<string>, rounds: number): number {
    for (let i = 0; i < rounds; i++) {
        image = extendImage(image, i == 0 ? '.' : image[0][0])
        image = enhance(image, lookup)
    }
    return image.flat().filter(v => v == '#').length
}

const input = fs.readFileSync('20/input.txt', 'utf8').trim().split('\n\n')
const lookup = input[0].split('')
const image = input[1].split('\n').map(row => row.split(''))

console.log('Part 1: '+run(image, lookup, 2))
console.log('Part 2: '+run(image, lookup, 50))
