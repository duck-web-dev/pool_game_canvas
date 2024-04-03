import React, { useRef, useEffect, useCallback, useMemo, useState } from 'react';
import PoolGameEngine from './lib/engine';
import './css/global.css';
import PopUp from './components/PopUp';

const App: React.FC = (() => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const gameEngineRef = useRef<PoolGameEngine | null>(null);

	// Popup
	const [activeBallId, setActiveBallId] = useState<number | null>(null);

	// Handle canvas click
	const canvasClickHandler = useCallback(
		(e: React.MouseEvent<HTMLCanvasElement>) => {
			if (!gameEngineRef.current) return;
			let c = gameEngineRef.current.handleMouseDown;
			if (c) {
				let ballId = c.bind(gameEngineRef.current)(e, true);
				if (!activeBallId && ballId) {
					// setActiveBallId(null);
					setActiveBallId(ballId);
				}
			}
		},
		[gameEngineRef.current, activeBallId]
	)

	// Handle canvas drag and release
	const canvasMouseDownHandler = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
		let c = gameEngineRef.current?.handleMouseDown;
		if (c) c.bind(gameEngineRef.current)(e, false);
	}, [gameEngineRef.current]);
	const canvasMouseMoveHandler = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
		let c = gameEngineRef.current?.handleMouseMove;
		if (c) c.bind(gameEngineRef.current)(e);
	}, [gameEngineRef.current]);
	const canvasMouseUpHandler = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
		let c = gameEngineRef.current?.handleMouseUp;
		if (c) c.bind(gameEngineRef.current)(e);
	}, [gameEngineRef.current]);

	// Init engine
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const engine = new PoolGameEngine(canvas);
		gameEngineRef.current = engine;	
		engine.start();
	
		return () => {
			if (gameEngineRef.current) {
				gameEngineRef.current.stop();
			}
		};
	}, []);

	return (
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: 'min-content', minWidth: 800}}>
			<h1>Simple Billiard Demo</h1>
			<p style={{animation: '1s ease-in-out infinite gray-glow'}}>Click a ball to change color. Drag and release to give momentum.</p>
			<div className="container" style={{width:800, height: 600}}>
				<canvas 
					ref={canvasRef}
					width={800} height={600}
					onClick={canvasClickHandler}
					onMouseDown={canvasMouseDownHandler}
					onMouseMove={canvasMouseMoveHandler}
					onMouseUp={canvasMouseUpHandler}
				></canvas>
				{ (gameEngineRef.current && (activeBallId!==null)) ? (
					<PopUp
						pos={gameEngineRef.current.getBallPosition(activeBallId) as Coordinates}
						defaultColor={gameEngineRef.current.getBallColor(activeBallId) as PoolBallColor}
						update={(color: PoolBallColor) => (gameEngineRef.current as PoolGameEngine).setBallColor(activeBallId, color)} 
						close={() => { setActiveBallId(null); }}
				/>) : <></> }
			</div>
		</div>
	);
});

export default App;
