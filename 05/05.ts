import * as fs from 'fs';

interface Coord {
    x: number
    y: number
}

class Line {
    start: Coord
    end: Coord
    points: Array<Coord>

    constructor(line: string) {
        const data = line.split('->').map(v => v.trim()).map(v =>
            v.split(',').map(Number))


        this.start = { x: data[0][0], y: data[0][1]}
        this.end = { x: data[1][0], y: data[1][1]}
        this.points = []
        this.draw()
    }

    is_simple(): boolean {
        const horizontal = this.start.y == this.end.y
        const vertical = this.start.x == this.end.x
        return horizontal || vertical
    }

    get_step(dist: number): number {
        if (dist == 0) {
            return 0
        }
        return dist > 0 ? 1 : -1
    }

    draw() {
        const step_x = this.get_step(this.end.x - this.start.x)
        const step_y = this.get_step(this.end.y - this.start.y)
        let x = this.start.x
        let y = this.start.y

        while (x != this.end.x || y != this.end.y) {
            this.points.push({x: x, y: y})
            x += step_x
            y += step_y
        }
        this.points.push({x: x, y: y})
    }
}

function run(lines: Array<Line>): number {
    const points = new Map<string, number>()
    lines.forEach(line =>
        line.points.forEach(point => {
            let prev = points.get(JSON.stringify(point))
            if (prev === undefined) {
                prev = 0
            }
            points.set(JSON.stringify(point), prev + 1)
        }
        )
    )
    return Array.from(points.values()).filter(v => v > 1).length
}

const lines = fs.readFileSync('05/input.txt','utf8').trim().split('\n').map(v => new Line(v))
console.log("Part 1: " + run(lines.filter(v => v.is_simple())))
console.log("Part 2: " + run(lines))
