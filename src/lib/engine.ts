import React from 'react';
import { calculateBallCoordinatesInGrid, getRandomPoolBallColor, getRelativeMouseCoordinates } from './utils';
import { sumVectors, circleVelocitiesAfterCollision, doCirclesCollide, isPointInCircle, resolveCirclesCollision, twoPointsToVector, resizeVector, scaleVector, distanceBetweenPoints } from './math';
import { drawArrow } from './draw';


class PoolGameEngine {
	public canvas: HTMLCanvasElement;
	public height: number;
	public width: number;

	private running: boolean = false;
	private ctx: CanvasRenderingContext2D;
	private balls: Array<PoolBall>;

	private secondsPassed: number = 0;
	private oldTimeStamp: number;
	private fps: number = 0;

	public selectedBall: PoolBall | null = null;
	private mouseDragCurPos: Coordinates | null = null;
	private isMouseDragging: boolean = false;
  
	constructor(canvas: HTMLCanvasElement) {
		// Basic initialization
		this.canvas = canvas;
		let ctx = canvas.getContext('2d');
		if (!ctx) throw new TypeError('2D context not available for given canvas');
		this.ctx = ctx;

		this.oldTimeStamp = Date.now();		
		this.width = canvas.width;
		this.height = canvas.height;

		// Generate balls
		let n = 3; // Size of initial grid, idk the rules
		let defaultRadius = 20;
		let coords = calculateBallCoordinatesInGrid(n, defaultRadius*2, 5, this.width*(2/3), this.height/2);
		this.balls = [];
		for (let i in coords) {
			let coord = coords[i];
			this.balls.push({
				id: (i as unknown as number),  // fix later, idk whats wrong
				pos: coord,
				vel: {x:0, y:0},
				color: getRandomPoolBallColor(),
				radius: defaultRadius
			})
		}
		this.balls.push({
			id: n*n,
			pos: {
				x: this.width*(1/5),
				y: this.height/2
			},
			vel: {x:0, y:0},
			color: getRandomPoolBallColor(),
			radius: defaultRadius
		})
	}
  
	// Okay some logic to use React and canvas endless loop.
	// Obviously we cant just use while true in React, and in any other JS project.
	// First of all we use requestAnimationFrame. And then we make sure that it only runs untill we stop it.
	public start(): void {
		if (!this.running) {
			console.info("Game Engine start");
			console.log(this.balls);
		  	this.running = true; this.loop();
		}
	}
	public stop(): void {
		this.running = false;
		console.info("Game Engine abort");
		// TODO: cancelAnimationFrame could be a better practice.
	}

	private loop(tickId: number = 0): void {
		this.tick();
		this.draw(tickId);
		if (this.running) requestAnimationFrame(() => this.loop(tickId+1));
	}
	


	public draw(tickId: number): void {
		// Background
		this.ctx.fillStyle = "#727272";
		this.ctx.fillRect(0, 0, this.width, this.height);

		// Balls (0_0)
		for (let ball of this.balls) {
			this.ctx.beginPath();
			this.ctx.arc(ball.pos.x, ball.pos.y, ball.radius, 0, 2*Math.PI, false);
			this.ctx.fillStyle = ball.color;
			this.ctx.closePath();
			this.ctx.fill();
			// this.ctx.font = "15px serif";
			// this.ctx.fillStyle = ball.color;
			// this.ctx.fillText(`vel ${ball.vel.x.toFixed(2)} ${ball.vel.y.toFixed(2)}`, ball.pos.x - 5, ball.pos.y - ball.radius - 5);
			// this.ctx.fillText(`pos ${ball.pos.x.toFixed(2)} ${ball.pos.y.toFixed(2)}`, ball.pos.x - 5, ball.pos.y - ball.radius - 20);
			// this.ctx.fillText(`id ${ball.id} color ${ball.color}`, ball.pos.x - 5, ball.pos.y - ball.radius - 20);
		}

		// Mouse drag arrow
		if (this.isMouseDragging) {
			let ball = (this.selectedBall as PoolBall);
			let start = ball.pos;
			let end = (this.mouseDragCurPos as Coordinates);
			if (distanceBetweenPoints(start, end) > ball.radius) {
				drawArrow(this.ctx, start, end, ball.color);
			}
		}

		// Debug info
		this.ctx.font = "10px serif";
		this.ctx.fillStyle = 'white';
		this.ctx.fillText(
			`${this.balls.length} Balls | Frame ${tickId} | Delta ${this.secondsPassed} | FPS ${this.fps}` + (this.isMouseDragging?' | Drag':''), 
			0, 10);
	}
  
	
	public tick(): void {
		// Calclulate delta and fps
		let t = Date.now();
		this.secondsPassed = (t - this.oldTimeStamp) / 1000;
	    this.oldTimeStamp = t;
		this.fps = Math.round(1 / (this.secondsPassed));

		for (let ball of this.balls) {
			// Apply current velocity
			ball.pos.x += ball.vel.x * this.secondsPassed;
			ball.pos.y += ball.vel.y * this.secondsPassed;

			// Detect edge collision and bounce
			let energyLoss = 0.3;
			if (ball.pos.x < ball.radius || ball.pos.x + ball.radius > this.width) {
				ball.pos.x -= ball.vel.x * this.secondsPassed * 3;
				ball.vel.x *= -(1 - energyLoss);
			}
			if (ball.pos.y < ball.radius || ball.pos.y + ball.radius > this.height) {
				ball.pos.y -= ball.vel.y  * this.secondsPassed * 3;
				ball.vel.y *= -(1 - energyLoss);
			}

			// Other balls collisions
			for (let second_ball of this.balls) {
				if (second_ball === ball) continue;
				if (doCirclesCollide(ball.pos, second_ball.pos, ball.radius, second_ball.radius)) {
					// Resolve collisions
					[ball.pos, second_ball.pos] = resolveCirclesCollision(ball.pos, second_ball.pos, ball.radius, second_ball.radius);
					// Get new velocities
					[ball.vel, second_ball.vel] = circleVelocitiesAfterCollision(ball.pos, second_ball.pos, ball.vel, second_ball.vel);
				}
			}

			// Friction
			let frictionLoss = 0.01;
			ball.vel.y -= ball.vel.y * (1 - frictionLoss) * this.secondsPassed;
			ball.vel.x -= ball.vel.x * (1 - frictionLoss) * this.secondsPassed;
			if (Math.abs(ball.vel.x) < 1) ball.vel.x = 0;
			if (Math.abs(ball.vel.y) < 1) ball.vel.y = 0;
		}
	}
  
	
	public handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>, asClick: boolean): number | void {
		const pos = getRelativeMouseCoordinates(e, this.canvas);
		console.debug('Mouse down at:', pos);
		for (let ball of this.balls) {
			if (isPointInCircle(pos, ball.pos, ball.radius)) {
				this.selectedBall = ball;
				if (asClick) {
					console.log('Ball clicked:', ball);
					return ball.id;
				} else {
					// this.mouseDragStartPos = 
					this.mouseDragCurPos = pos; 
					this.isMouseDragging = true;
					console.log('Ball selected:', ball);
				}
			}
		}
	}
	public handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>): void {
		this.mouseDragCurPos = getRelativeMouseCoordinates(e, this.canvas);
	}
	public handleMouseUp(e: React.MouseEvent<HTMLCanvasElement>): void {
		const pos = getRelativeMouseCoordinates(e, this.canvas);
		if (!this.isMouseDragging) return;
		console.debug('Mouse release at:', pos);
		this.isMouseDragging = false;
		let ball = this.selectedBall as PoolBall;
		let mouseMoveVector = scaleVector(twoPointsToVector(
			ball.pos, pos
		), 2);
		ball.vel = sumVectors(
			ball.vel, mouseMoveVector
		)
		console.log('Mouse drag release vector:', mouseMoveVector)
	}

	public getBallColor(id: number): PoolBallColor | undefined {
		return this.balls.filter(e => e.id == id).at(0)?.color;
	}
	public getBallPosition(id: number): Coordinates | undefined {
		return this.balls.filter(e => e.id == id).at(0)?.pos;
	}
	public setBallColor(id: number, color: PoolBallColor): void {
		let b = this.balls.filter(e => e.id == id).at(0);
		if (b) b.color = color;
	}
}


export default PoolGameEngine;