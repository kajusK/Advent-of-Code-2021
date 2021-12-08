import * as fs from 'fs';

class  Display {
    outputs: Array<string>
    digits: Map<number, string>

    constructor(line: string) {
        const [inputs, outputs] = line.split('|').map(v => v.trim().split(' '))
        this.outputs = outputs

        /*
         *  1 = 2 segments
         *  4 = 4 segments
         *  7 = 3 segments
         *  8 = 7 segments
         *  9 = 6 segments and same segments as in 4
         *  6 = 6 segments and not same segments as in 1
         *  0 = 6 segments and same segments as in 1 and not as in 4
         *  3 = 5 segments and same segments as in 1
         *  2 = 5 segments and not as in 1 and has segment c
         *  5 = 5 segments and not as in 1 has not c
         *
         *  Segment c is characters from 1 without characters from 6
         */
        this.digits = new Map<number, string>()
        this.digits.set(1, inputs.filter(v => v.length == 2)[0])
        this.digits.set(4, inputs.filter(v => v.length == 4)[0])
        this.digits.set(7, inputs.filter(v => v.length == 3)[0])
        this.digits.set(8, inputs.filter(v => v.length == 7)[0])
        this.digits.set(9, inputs.filter(v => v.length == 6 &&
            this.hasAll(v, this.digits.get(4)))[0])
        this.digits.set(6, inputs.filter(v => v.length == 6 &&
            !this.hasAll(v, this.digits.get(1)))[0])
        this.digits.set(0, inputs.filter(v => v.length == 6 &&
            this.hasAll(v, this.digits.get(1)) &&
            !this.hasAll(v, this.digits.get(4)))[0])
        this.digits.set(3, inputs.filter(v => v.length == 5 &&
            this.hasAll(v, this.digits.get(1)))[0])

        const c = Array.from(this.digits.get(1) as string).filter(v =>
            !this.digits.get(6)?.includes(v))[0]
        this.digits.set(2, inputs.filter(v => v.length == 5 &&
            !this.hasAll(v, this.digits.get(1)) &&
            v.includes(c))[0])
        this.digits.set(5, inputs.filter(v => v.length == 5 &&
            !this.hasAll(v, this.digits.get(1)) &&
            !v.includes(c))[0])
    }

    /**
     * Check if digit has all given segments set
     * @param digit Input digit to check if contains all segments
     * @param segments Segments to check for
     */
    private hasAll(digit: string, segments?: string): boolean {
        return Array.from(segments as string).every(c => digit.includes(c))
    }

    /**
     * Convert digit segments to corresponding number representation
     * @param digit Digit segments to be converted to number
     */
    getNumber(digit: string): number {
        for (const [key, value] of Array.from(this.digits.entries())) {
            if (digit.length == value.length &&
                Array.from(digit).every(c => value.includes(c))) {

                return key
            }
        }
        throw new Error(`Number ${digit} not found`)
    }

    getPart1(): number {
        return this.outputs.map(v => v.length).filter(v =>
            v == 2 || v == 4 || v == 3 || v == 7).length
    }

    getOutput(): number {
        const nums = this.outputs.map(v => this.getNumber(v))
        return nums.reduce((a, v) => a*10 + v)
    }
}

const displays = fs.readFileSync('08/input.txt','utf8').trim().split('\n').map(v => new Display(v))
console.log("Part 1: "+displays.map(v => v.getPart1()).reduce((a, v) => a+v))
console.log("Part 2: "+displays.map(v => v.getOutput()).reduce((a, v) => a+v))
