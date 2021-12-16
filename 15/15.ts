import * as fs from 'fs';

class PriorityQueue {
    queue: [Array<number>, number][] = []

    push(pos: Array<number>, priority: number) {
        this.queue.push([pos, priority])
    }

    pop(): Array<number> {
        let min = this.queue[0][1]
        let index = 0

        this.queue.forEach((v, i) => {
            if (v[1] < min) {
                min = v[1]
                index = i
            }
        })

        return this.queue.splice(index, 1)[0][0]
    }

    empty(): boolean {
        return this.queue.length == 0
    }
}

function dijkstra(map: Array<Array<number>>): number {
    const dirs = [
        [-1, 0],
        [0, -1],
        [1, 0],
        [0, 1],
    ]
    const frontier = new PriorityQueue()
    const start = [0, 0]
    const goal = [map[0].length-1, map.length-1]
    frontier.push(start, 0)

    const cost_so_far = new Map<string, number>()
    cost_so_far.set(JSON.stringify(start), 0)

    while (!frontier.empty()) {
        const current = frontier.pop()
        if (current[0] == goal[0] && current[1] == goal[1]) {
            return cost_so_far.get(JSON.stringify(goal))!
        }

        const neighbors = dirs.map(dir => dir.map((v, i) => v+current[i])).filter(v =>
            v[0] >= 0 && v[0] < map[0].length && v[1] >= 0 && v[1] < map.length)

        for (const next of neighbors) {
            const new_cost = cost_so_far.get(JSON.stringify(current))! + map[next[1]][next[0]]
            const so_far = cost_so_far.get(JSON.stringify(next))
            if (so_far === undefined || new_cost < so_far) {
                cost_so_far.set(JSON.stringify(next), new_cost)
                frontier.push(next, new_cost)
            }
        }
    }

    return -1
}

function extendMap(map: Array<Array<number>>, repeat: number): Array<Array<number>> {
    const fullMap = Array<Array<number>>()

    let rows = map.map((row) => {
        let line = Array<number>()
        for (let i = 0; i < repeat; i++) {
            line = line.concat(row)
            row = row.map(v => v+1 > 9 ? 1 : v+1)
        }
        return line
    })

    for (let i = 0; i < repeat; i++) {
        rows.forEach(row => fullMap.push(row))
        rows = rows.map(row => row.map(v => v+1 > 9 ? 1: v+1))
    }
    return fullMap
}

const map = fs.readFileSync('15/input.txt', 'utf8').trim().split('\n').map(v => Array.from(v).map(Number))
console.log("Part 1: " + dijkstra(map))
console.log("Part 2: " + dijkstra(extendMap(map, 5)))
