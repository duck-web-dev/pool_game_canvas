import React, { useRef, useEffect, useCallback, useMemo, useState } from 'react';
import PoolGameEngine from './lib/engine';
import styles from './css/popup.css';
import './css/global.css';

const App: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const gameEngineRef = useRef<PoolGameEngine | null>(null);

	// Popup
	const [isPopupShown, setIsPopupShown] = useState<boolean>(false);

	// Handle canvas click
	const canvasClickHandler = useCallback(
		(e: React.MouseEvent<HTMLCanvasElement>) => {
			let c = gameEngineRef.current?.handleMouseDown;
			if (c) c.bind(gameEngineRef.current)(e, true);
		},
		[gameEngineRef.current]
	)

	// Handle canvas drag and release
	const canvasMouseDownHandler = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
		let c = gameEngineRef.current?.handleMouseDown;
		if (c) c.bind(gameEngineRef.current)(e, false);
	}, [gameEngineRef.current])
	const canvasMouseMoveHandler = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
		let c = gameEngineRef.current?.handleMouseMove;
		if (c) c.bind(gameEngineRef.current)(e);
	}, [gameEngineRef.current])
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
	}, [canvasRef.current]);

	return (
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: 'min-content', minWidth: 800}}>
			<h1>Simple Billiards Demo</h1>
			<div className="container" style={{width:800, height: 600}}>
				<canvas 
					ref={canvasRef}
					width={800} height={600}
					onClick={canvasClickHandler}
					onMouseDown={canvasMouseDownHandler}
					onMouseMove={canvasMouseMoveHandler}
					onMouseUp={canvasMouseUpHandler}
				></canvas>
				{isPopupShown ? <div className={styles.popup}>{
					
				}</div> : <></>}
			</div>
		</div>
	);
};

export default App;
