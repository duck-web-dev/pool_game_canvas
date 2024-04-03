export function calculateBallCoordinatesInGrid(n: number, ballSize: number, margin: number, centerX: number, centerY: number): Coordinates[] {
    const coordinates: Array<Coordinates> = [];

    const startX = centerX - Math.floor(n / 2) * (ballSize + margin);
    const startY = centerY - Math.floor(n / 2) * (ballSize + margin);

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const x = startX + j * (ballSize + margin);
            const y = startY + i * (ballSize + margin);
            coordinates.push({ x, y });
        }
    }

    return coordinates;
}

export const PoolBallColorValues: Array<PoolBallColor>  = ['green', 'red', 'yellow', 'blue', 'purple', 'black', 'white'];
export function getRandomPoolBallColor(): PoolBallColor {
	return PoolBallColorValues[Math.round(Math.random() * (PoolBallColorValues.length-1))];
}