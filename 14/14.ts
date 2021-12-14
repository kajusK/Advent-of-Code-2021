import * as fs from 'fs';

class Polymer {
    map: Map<string, string> = new Map()
    pairs: Map<string, number> = new Map()
    counts: Map<string, number> = new Map()

    constructor(template: string, input: string) {
        input.split('\n').map(v => v.split(' -> ')).forEach(([pair, insert]) =>
            this.map.set(pair, insert))

        const pairs = Array.from(template).map((v, i, arr) => v+arr[i+1]).slice(0, -1)
        pairs.forEach(v => this.pairs.set(v, (this.pairs.get(v) || 0) + 1))

        Array.from(template).forEach(v => this.counts.set(v, (this.counts.get(v) || 0)+1))
    }

    extendPair(pair: string, newChar: string): Array<string> {
        const chars = Array.from(pair)
        return [chars[0]+newChar, newChar+chars[1]]
    }

    round() {
        const result = new Map<string, number>()
        this.pairs.forEach((count, pair) => {
            const newChar = this.map.get(pair)!
            this.counts.set(newChar, (this.counts.get(newChar) || 0) + count)

            this.extendPair(pair, newChar).forEach(v => {
                result.set(v, (result.get(v) || 0) + count)
            })
        })
        this.pairs = result
    }

    getResult(): number {
        const max = Math.max(...Array.from(this.counts.values()))
        const min = Math.min(...Array.from(this.counts.values()))
        return max - min
    }
}

const [template, input] = fs.readFileSync('14/input.txt', 'utf8').trim().split('\n\n')
const polymer = new Polymer(template, input)

for (let i = 0; i < 10; i++) {
    polymer.round()
}
console.log("Part 1: " + polymer.getResult())

for (let i = 0; i < 30; i++) {
    polymer.round()
}
console.log("Part 2: " + polymer.getResult())
