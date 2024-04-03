export function isPointInCircle(point: Coordinates, center: Coordinates, radius: number): boolean {
	return (point.x - center.x)**2 + (point.y - center.y)**2 < radius**2;
}

export function doCirclesCollide(center1: Coordinates, center2: Coordinates, radius1: number, radius2: number): boolean {
	return ((center1.x-center2.x)**2 + (center1.y-center2.y)**2) <= (radius1+radius2)**2
}

export function distanceBetweenPoints(point1: Coordinates, point2: Coordinates): number {
	return Math.sqrt((point1.x - point2.x)**2 + (point1.y - point2.y)**2)
}
export function twoPointsToVector(from: Coordinates, to: Coordinates): Vector {
	return {
		x: to.x - from.x,
		y: to.y - from.y
	}
}

export function resizeVector(vector: Vector, newLength: number): Vector {
	let hypot = Math.sqrt(vector.x ** 2 + vector.y ** 2);
	return {
		x: newLength * (vector.x / hypot),
		y: newLength * (vector.y / hypot)
	}
}
export function scaleVector(vector: Vector, times: number): Vector {
	return {
		x: times * vector.x,
		y: times * vector.y
	}
}
export function sumVectors(vector1: Vector, vector2: Vector): Vector {
	return {
		x: vector1.x + vector2.x,
		y: vector1.y + vector2.y
	}
}

export function lineSegmentFromNormal(vector: Vector, pos: Coordinates, length: number): LineSegment {
	let newVector = resizeVector(vector, length);
	return {
		start: pos,
		end: {
			x: pos.x + newVector.x,
			y: pos.y + newVector.y
		}
	}
}

export function applyVectorToPoint(vector: Vector, point: Coordinates): Coordinates {
	let res = {
		x: point.x + vector.x,
		y: point.y + vector.y
	}
	return res;
}

// Static resolution
export function resolveCirclesCollision(pos1: Coordinates, pos2: Coordinates, radius1: number, radius2: number): [Coordinates, Coordinates] {
	let diff = (radius1 + radius2) - distanceBetweenPoints(pos1, pos2);
	pos1 = lineSegmentFromNormal(twoPointsToVector(pos2, pos1), pos1, diff/2).end;
	pos2 = lineSegmentFromNormal(twoPointsToVector(pos1, pos2), pos2, diff/2).end;
	return [pos1, pos2];
}

// Dynamic collision resolving
export function circleVelocitiesAfterCollision(pos1: Coordinates, pos2: Coordinates, vel1: Vector, vel2: Vector): [Vector, Vector] {
	let diff = distanceBetweenPoints(pos1, pos2);
	let normalVector: Vector = {
		x: (pos2.x - pos1.x) / diff,
		y: (pos2.y - pos1.y) / diff
	};
	let tangentVector: Vector = {
		x: -1 * normalVector.y,
		y: normalVector.x
	}
	// Dot product for normal and tangent
	let energyLoss = 0.3;
	let dpNormal1 = (vel1.x * normalVector.x + vel1.y * normalVector.y) * (1 - energyLoss)
	let dpNormal2 = (vel2.x * normalVector.x + vel2.y * normalVector.y) * (1 - energyLoss)
	let dpTan1 = (vel1.x * tangentVector.x + vel1.y * tangentVector.y) * (1 - energyLoss)
	let dpTan2 = (vel2.x * tangentVector.x + vel2.y * tangentVector.y) * (1 - energyLoss)
	
	return [
		{
			x: tangentVector.x * dpTan1 + normalVector.x * dpNormal2,
			y: tangentVector.y * dpTan1 + normalVector.y * dpNormal2
		},
		{
			x: tangentVector.x * dpTan2 + normalVector.x * dpNormal1,
			y: tangentVector.y * dpTan2 + normalVector.y * dpNormal1
		}
	]
}