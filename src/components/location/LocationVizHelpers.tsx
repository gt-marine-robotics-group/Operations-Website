import { C_Location, VIZ_PRIORITY_LOCATION_TYPES } from "../../database/interfaces/Location"

const BG_SQUARE_COLOR = '#c3c3d6'
const BG_WALL_COLOR = '#666696'

const LOCATION_COLORS = {
    'Wall': '#559bfb', // sky blue
    'Table': '#35734f', // green
    'Shelf': '',
    'Bin': '',
    'Area': ''
}

const doorWays = [
    {x: 12, y: 30, len: 6},
    {x: 24, y: 18, len: 3}
]

function squareAroundDoorWay(row:number, col:number) {
    console.log('row', row)
    console.log('col', col)
    for (const door of doorWays) {
        if (door.x <= col && door.x + door.len > col) {
            console.log('passed x check')
        }
        if (door.y - 1 <= row && door.y + 1 > row) {
            console.log('passed y check')
        }
        if (door.x <= col && door.x + door.len > col
                && door.y - 1 <= row && door.y + 1 > row) {
            console.log('returning true')
            return true
        }
    }
    return false
}

function pxToI(px:number) {
    return (px - 10) / 26
}

function fillSquareWhite(ctx:CanvasRenderingContext2D, x:number, y:number) {
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.fillRect(x, y, 26, 26)
}

export function drawBg(ctx:CanvasRenderingContext2D) {

    for (let rowPx = 10; rowPx + 26 < 800; rowPx += 26) {
        for (let colPx = 10; colPx + 26 < 800; colPx += 26) {

            if (pxToI(rowPx) < 3 && pxToI(colPx) > 6) {
                fillSquareWhite(ctx, colPx, rowPx)
                continue
            }
            if (pxToI(rowPx) > 17 && pxToI(colPx) < 11) {
                fillSquareWhite(ctx, colPx, rowPx)
                continue
            }

            // if (squareAroundDoorWay(pxToI(rowPx), pxToI(colPx))) continue

            ctx.fillStyle = BG_SQUARE_COLOR
            ctx.beginPath()
            ctx.fillRect(colPx, rowPx, 24, 24)
        }
    }

    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, 800, 10)
    ctx.fillRect(0, 0, 10, 800)
    ctx.fillRect(790, 0, 10, 800)
    ctx.fillRect(0, 790, 800, 10)


    ctx.fillStyle = BG_WALL_COLOR

    ctx.fillRect(8, 8, 26 * 7, 2)
    ctx.fillRect(8, 10, 2, 26 * 18)
    ctx.fillRect(10, 8 + 26 * 18, 26 * 11, 2)
    ctx.fillRect(26 * 11 + 8, 8 + 26 * 18, 2, 26 * 12)
    ctx.fillRect(26 * 11 + 8, (26 * 12) + (26 * 18 + 8), 26, 2)

    ctx.fillRect(26 * 18 + 10, 788, 26 * 12, 2)
    ctx.fillRect(26 * 30 + 8, 3 * 26 + 8, 2, 26 * 27)
    ctx.fillRect(26 * 7 + 8, 3 * 26 + 8, 26 * 23, 2)
    ctx.fillRect(26 * 7 + 8, 8, 2, 3 * 26)

    ctx.fillRect(26 * 21 + 8, 18 * 26 + 8, 2, 26 * 12)
    ctx.fillRect(26 * 21 + 8, 18 * 26 + 8, 3 * 26, 2)
    ctx.fillRect(26 * 27 + 10, 18 * 26 + 8, 3 * 26, 2)
}

export function drawLocations(ctx:CanvasRenderingContext2D, 
    locations:C_Location[]) {

    const filledSquarePriorities:{[s:string]: number} = {}

    locations.forEach(loc => {
        switch (loc.data.type) {
            case 'Wall':
                drawWall(ctx, loc)
                break
            default:
                drawLocation(ctx, loc, filledSquarePriorities)
                break
        }
    })
}

function drawLocation(ctx:CanvasRenderingContext2D, loc:C_Location,
    filledSquarePriorities:{[s:string]: number})  {
    ctx.fillStyle = LOCATION_COLORS[loc.data.type]
    loc.data.squares.forEach(square => {
        const x = square[0] * 26 + 10
        const y = square[1] * 26 + 10
        const strSquare = x.toString() + '_' + y.toString()
        if (strSquare in filledSquarePriorities &&
            filledSquarePriorities[strSquare] < 
            VIZ_PRIORITY_LOCATION_TYPES[loc.data.type]) return
        filledSquarePriorities[strSquare] = VIZ_PRIORITY_LOCATION_TYPES[loc.data.type]
        ctx.fillRect(x, y, 24, 24)
    })
}

function drawWall(ctx:CanvasRenderingContext2D, loc:C_Location) {
    ctx.fillStyle = LOCATION_COLORS['Wall']
    loc.data.squares.forEach(square => {
        const x = square[0] * 26 + 10
        const y = square[1] * 26 + 10
        if (loc.data.direction === 'left') {
            ctx.fillRect(x - 2, y - 2, 2, 26)
        } else if (loc.data.direction === 'right') {
            ctx.fillRect(x + 24, y, 2, 26)
        } else if (loc.data.direction === 'down') {
            ctx.fillRect(x, y + 24, 26, 2)
        } else {
            ctx.fillRect(x, y - 2, 26, 2)
        }
    })
}