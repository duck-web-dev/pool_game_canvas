type PoolBallColor = 'green' | 'red' | 'yellow' | 'blue' | 'purple' | 'black' | 'white';

interface Coordinates {
	x: number;
	y: number;
}

interface PoolBall {
	pos: Coordinates;
	vel: Coordinates;  // velocity
	radius: number;
	color: PoolBallColor; 
}