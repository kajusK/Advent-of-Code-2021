import { match } from 'assert';
import * as fs from 'fs';

class Vector {
    data: Array<number>
    length: number

    constructor(data: Array<number>) {
        this.data = data
        this.length = Math.sqrt(data.map(v => Math.pow(v, 2)).reduce((acc, v) => acc + v))
    }

    sub(b: Vector): Vector {
        return new Vector(this.data.map((v, i) => v - b.data[i]))
    }

    add(b: Vector): Vector {
        return new Vector(this.data.map((v, i) => v + b.data[i]))
    }

    rotate(rotation: number): Vector {
        const [x, y, z] = this.data

        /* Faster and easier than rotational matrix */
        const rotations = [
            [x, y, z],
            [x, -z, y],
            [x, -y, -z],
            [x, z, -y],
            [-y, x, z],
            [z, x, y],
            [y, x, -z],
            [-z, x, -y],
            [-x, -y, z],
            [-x, -z, -y],
            [-x, y, -z],
            [-x, z, y],
            [y, -x, z],
            [z, -x, -y],
            [-y, -x, -z],
            [-z, -x, y],
            [-z, y, x],
            [y, z, x],
            [z, -y, x],
            [-y,-z, x],
            [-z, -y, -x],
            [-y, z, -x],
            [z, y, -x],
            [y, -z, -x],
        ]

        return new Vector(rotations[rotation])
    }

    equals(vector: Vector): boolean {
        return this.data.every((v, i) => v == vector.data[i])
    }
}


class Pair {
    beaconA: Vector
    beaconB: Vector
    vector: Vector

    constructor(a: Vector, b: Vector) {
        this.beaconA = a
        this.beaconB = b
        this.vector = b.sub(a)
    }

    equals(pair: Pair) {
        return this.vector.equals(pair.vector)
    }
}

class Scanner {
    beacons: Array<Vector>
    pairs: Array<Pair> = []
    position: Vector = new Vector([0, 0, 0])
    rotation = 0

    constructor(data: string) {
        this.beacons = data.split('\n').filter(v => !v.startsWith('---')).map(beacon =>
            new Vector(beacon.split(',').map(Number)))
        this.genPairs()
    }

    /* Generate pairs of beacons with vector between them (both directions) */
    private genPairs() {
        this.pairs = []
        for (const a of this.beacons) {
            for (const b of this.beacons) {
                if (a == b) {
                    continue
                }
                this.pairs.push(new Pair(a, b))
            }
        }
    }

    private findMatch(scanner: Scanner): boolean {
        /* Filter pairs with matching length to speed up the rotation */
        const localPairs = this.pairs.filter(v => scanner.pairs.some(b => b.vector.length == v.vector.length))
        const remotePairs = scanner.pairs.filter(v => localPairs.some(b => b.vector.length == v.vector.length))

        for (let rotation = 0; rotation < 24; rotation++) {
            const vectors = remotePairs.map(v => v.vector.rotate(rotation))
            const common = localPairs.filter(v => vectors.some(b => b.equals(v.vector)))
            /* Common contains vector between all 12 (minimum) points - 12*(12-1) */
            if (common.length >= 132) {
                const local = common[0].beaconA
                const remote = remotePairs.filter(v => v.vector.rotate(rotation).equals(common[0].vector))[0]
                scanner.translate(local.sub(remote.beaconA.rotate(rotation)), rotation)
                return true
            }
        }
        return false
    }

    merge(scanner: Scanner): boolean {
        if (!this.findMatch(scanner)) {
            return false
        }
        scanner.beacons.filter(v => !this.beacons.some(b => b.equals(v))).forEach(beacon =>
            this.beacons.push(beacon))
        this.genPairs()
        return true
    }

    translate(position: Vector, rotation: number) {
        console.log("Found position: "+position.data)
        this.position = position
        this.rotation = rotation
        this.beacons = this.beacons.map(beacon => beacon.rotate(rotation).add(position))
    }
}

function manhattan(a: Vector, b: Vector): number {
    return a.data.map((v, i) => Math.abs(v - b.data[i])).reduce((a, v) => a+v)
}

const scanners = fs.readFileSync('19/input.txt', 'utf8').trim().split('\n\n').map(scanner =>
    new Scanner(scanner))

let remaining = scanners.slice(1)
while (remaining.length) {
    remaining = remaining.filter(v => !scanners[0].merge(v))
}

console.log("Part 1: "+scanners[0].beacons.length)

const positions = scanners.map(v => v.position)
const distances = Array<number>()
for (const a of positions) {
    for (const b of positions) {
        distances.push(manhattan(a, b))
    }
}

console.log("Part2: "+Math.max(...distances))
