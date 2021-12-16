import * as fs from 'fs';

class Packet {
    version: number
    type: number
    bits: number
    subpackets: Array<Packet>
    literal: number

    constructor(data: Array<string>) {
        this.version = parseInt(data.splice(0, 3).join(''), 2)
        this.type = parseInt(data.splice(0, 3).join(''), 2)
        this.literal = 0
        this.subpackets = []
        this.bits = 6

        if (this.type == 4) {
            let last = false
            let literal = Array<string>()
            while (!last) {
                last = data.splice(0, 1)[0] == '0'
                literal = literal.concat(data.splice(0, 4))
                this.bits += 5
            }
            this.literal = parseInt(literal.join(''), 2)
        } else {
            const operatorType = data.splice(0, 1)[0]
            this.bits += 1
            if (operatorType == '0') {
                let length = parseInt(data.splice(0, 15).join(''), 2)
                this.bits += length + 15
                while (length != 0) {
                    const newPacket = new Packet(data)
                    this.subpackets.push(newPacket)
                    length -= newPacket.bits
                }
            } else if (operatorType == '1') {
                let subpackets = parseInt(data.splice(0, 11).join(''), 2)
                this.bits += 11
                while (subpackets != 0) {
                    const newPacket = new Packet(data)
                    this.subpackets.push(newPacket)
                    subpackets -= 1
                    this.bits += newPacket.bits
                }
            }
        }
    }

    sumVersions(): number {
        if (this.subpackets.length == 0) {
            return this.version
        }
        return this.version + this.subpackets.map(v =>
            v.sumVersions()).reduce((a, v) => a+v)
    }

    result(): number {
        switch (this.type) {
            case 0:
                return this.subpackets.map(v => v.result()).reduce((a, v) => a + v)
            case 1:
                return this.subpackets.map(v => v.result()).reduce((a, v) => a * v)
            case 2:
                return Math.min(...this.subpackets.map(v => v.result()))
            case 3:
                return Math.max(...this.subpackets.map(v => v.result()))
            case 4:
                return this.literal
            case 5:
                return this.subpackets[0].literal > this.subpackets[1].literal ? 1 : 0
            case 6:
                return this.subpackets[0].literal < this.subpackets[1].literal ? 1 : 0
            case 7:
                return this.subpackets[0].literal == this.subpackets[1].literal ? 1 : 0
        }
        return NaN
    }
}


const data = fs.readFileSync('16/input.txt', 'utf8').trim().split('').map(v =>
    parseInt(v, 16).toString(2).padStart(4, '0')).join('').split('')

const packet = new Packet(data)
console.log("Part 1: "+packet.sumVersions())
/* TODO: Gives incorrect result for full input, works for examples */
console.log("Part 2: "+packet.result())
