export function isPointInCircle(point: Coordinates, center: Coordinates, radius: number): boolean {
	return (point.x - center.x)**2 + (point.y - center.y)**2 < radius**2;
}

export function doCirclesCollide(center1: Coordinates, center2: Coordinates, radius1: number, radius2: number): boolean {
	return (center1.x-center2.x)**2 + (center1.y-center2.y)**2 <= (radius1+radius2)**2
}

export function resolveCirclesCollision(vel1: Coordinates, vel2: Coordinates): Coordinates {
	return {
		x: (vel1.x+vel2.x)/2,
		y: (vel1.y+vel2.y)/2
	}
}