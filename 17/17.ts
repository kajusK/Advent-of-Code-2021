interface position {
    x: number
    y: number
}

interface velocity {
    vx: number
    vy: number
}

class Probe {
    targetX: Array<number>
    targetY: Array<number>
    position: position = {x: 0, y: 0}
    velocity: velocity = {vx: 0, vy: 0}
    maxY = 0
    hits = 0

    constructor(targetX: Array<number>, targetY: Array<number>) {
        this.targetX = targetX
        this.targetY = targetY
    }

    findHighest(): number {
        let highest = 0

        for (let vx = 0; vx <= this.targetX[1]; vx++) {
            for (let vy = this.targetY[0]; vy < 1000; vy++) {
                const res = this.tryHit({vx: vx, vy: vy})
                if (res && this.maxY > highest) {
                    highest = this.maxY
                }
            }
        }
        return highest
    }

    tryHit(velocity: velocity): boolean {
        this.velocity = velocity
        this.position = {x: 0, y: 0}
        this.maxY = 0
        let hit = false

        while (!hit && this.position.x < this.targetX[1] && this.position.y > this.targetY[0]) {
            this.step()
            hit = this.hit()
        }

        if (hit) {
            this.hits++
        }
        return hit
    }

    hit(): boolean {
        return this.position.x >= this.targetX[0] && this.position.x <= this.targetX[1] &&
            this.position.y >= this.targetY[0] && this.position.y <= this.targetY[1]
    }

    step() {
        this.position.x += this.velocity.vx
        this.position.y += this.velocity.vy

        this.velocity.vy--
        if (this.velocity.vx > 0) {
            this.velocity.vx--
        }
        if (this.velocity.vx < 0) {
            this.velocity.vx++
        }

        if (this.position.y > this.maxY) {
            this.maxY = this.position.y
        }
    }
}

const probe = new Probe([25, 67], [-260, -200])
console.log("Part 1: "+probe.findHighest())
console.log("Part 2: "+probe.hits)
