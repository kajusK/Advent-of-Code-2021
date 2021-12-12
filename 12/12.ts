import * as fs from 'fs';


function singleAllowed(path: Array<string>, node: string): boolean {
    return node == node.toUpperCase() || !path.includes(node)
}

function doubleAllowed(path: Array<string>, node: string): boolean {
    if (singleAllowed(path, node)) {
        return true
    }

    const counts = new Map<string, number>()
    path.filter(v => v == v.toLowerCase()).forEach(v => counts.set(v, (counts.get(v) || 0) + 1))
    return Array.from(counts.values()).every(v => v <= 1)
}

class DFS {
    graph: Map<string, Array<string>>
    paths: Array<Array<string>>

    constructor(input: Array<string>) {
        this.graph = new Map<string, Array<string>>()
        input.map(v => v.split('-')).forEach(([from, to]) => this.addNode(from, to))
        this.paths = []
    }

    private addNode(from: string, to: string) {
        const node = this.graph.get(from)
        if (node === undefined) {
            this.graph.set(from, [to])
            this.addNode(to, from)
        } else if (!node.includes(to)) {
            node.push(to)
            this.addNode(to, from)
        }
    }

    findPaths(node: string, path: Array<string>, isAllowed: (path: Array<string>, node: string) => boolean) {
        /* Small caves can be visited only once */
        if (!isAllowed(path, node)) {
            return
        }

        const adjacents = this.graph.get(node)!
        const newPath = [...path]
        newPath.push(node)
        if (node == 'end') {
            this.paths.push(path)
            return
        }

        for (const adjacent of adjacents) {
            if (adjacent == 'start') {
                continue
            }
            this.findPaths(adjacent, newPath, isAllowed)
        }
    }
}

const dfs = new DFS(fs.readFileSync('12/input.txt', 'utf8').trim().split('\n'))
dfs.findPaths('start', [], singleAllowed)
console.log("Part 1: " +dfs.paths.length)

dfs.paths = []
dfs.findPaths('start', [], doubleAllowed)
console.log("Part 2: " +dfs.paths.length)
