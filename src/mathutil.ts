
export function dist(x:number, y:number, x2:number, y2:number): number {
    return Math.sqrt( (x2 - x) * (x2 - x) + (y2 - y) * (y2 - y) );
}
