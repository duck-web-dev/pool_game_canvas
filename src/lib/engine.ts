import React from 'react';
import { calculateBallCoordinatesInGrid, getRandomPoolBallColor } from './utils';
import { isPointInCircle } from './math';


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
		for (let coord of coords)	{
			this.balls.push({
				pos: coord,
				vel: {x:0, y:0},
				color: getRandomPoolBallColor(),
				radius: defaultRadius
			})
		}
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

			this.ctx.font = "15px serif";
			this.ctx.fillStyle = ball.color;
			this.ctx.fillText(`vel ${ball.vel.x} ${ball.vel.y}`, ball.pos.x- 5, ball.pos.y - ball.radius - 5);
		}

		// Debug info
		this.ctx.font = "10px serif";
		this.ctx.fillStyle = 'white';
		this.ctx.fillText(`${this.balls.length} Balls | Frame ${tickId} | Delta ${this.secondsPassed} | FPS ${this.fps}`, 0, 10);
	}
  
	
	public tick(): void {
		let t = Date.now();
		this.secondsPassed = (t - this.oldTimeStamp) / 1000;
	    this.oldTimeStamp = t;
		this.fps = Math.round(1 / (this.secondsPassed));

		for (let ball of this.balls) {
			ball.pos.x += ball.vel.x * this.secondsPassed;
			ball.pos.y += ball.vel.y * this.secondsPassed;

			if (ball.pos.x < 0 || ball.pos.x > this.width) {
				ball.pos.x -= ball.vel.x * this.secondsPassed * 3;
				console.log(ball.vel.x)
				ball.vel.x *= -1;
				console.log(ball.vel.x)
			}
			if (ball.pos.y < 0 || ball.pos.y > this.height) {
				ball.pos.y -= ball.vel.y  * this.secondsPassed * 3;
				ball.vel.y *= -1;
			}

			ball.vel.y -= ball.vel.y * 0.97 * this.secondsPassed;
			ball.vel.x -= ball.vel.x * 0.97 * this.secondsPassed;
			if (Math.abs(ball.vel.x) < 1) ball.vel.x = 0;
			if (Math.abs(ball.vel.y) < 1) ball.vel.y = 0;
		}
	}
  
	
	public handleClick(e: React.MouseEvent<HTMLCanvasElement>): void {
		const rect = this.canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		console.log('Click at:', x, y);
		for (let ball of this.balls) {
			if (isPointInCircle({x,y}, ball.pos, ball.radius)) {
				console.log('Ball clicked:', ball);
				ball.vel.x += 500 * (Math.random() - 0.5);
				ball.vel.y += 500 * (Math.random() - 0.5);
			}
		}
	}
}


export default PoolGameEngine;