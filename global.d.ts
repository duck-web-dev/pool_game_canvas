declare module '*.css' {
	const classes: { [key: string]: string };
	export default classes;
}


type PoolBallColor = 'green' | 'red' | 'yellow' | 'blue' | 'purple' | 'black' | 'white';
interface PoolBall {
	id: number;
	pos: Coordinates;
	vel: Vector;        // velocity
	radius: number;
	color: PoolBallColor; 
}

interface Coordinates {
	x: number;
	y: number;
}
interface Vector {
	x: number;
	y: number;
}
interface LineSegment {
	start: Coordinates;
	end: Coordinates;
}