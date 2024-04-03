import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { PoolBallColorValues } from './lib/utils';
import PoolGameEngine from './lib/engine';

const App: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const gameEngineRef = useRef<PoolGameEngine | null>(null);
	
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

	const canvasClickHandler = useCallback(
		(e: React.MouseEvent<HTMLCanvasElement>) => {
			console.debug('Canvas click handler', e);
			let c = gameEngineRef.current?.handleClick;
			if (c) c.bind(gameEngineRef.current)(e);
		},
		[gameEngineRef.current]
	)

	return (
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: 'min-content', minWidth: 800}}>
			<h1>Simple Billiards Demo</h1>
			<canvas ref={canvasRef} width={800} height={600} onClick={canvasClickHandler}></canvas>
		</div>
	);
};

export default App;
