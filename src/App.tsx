import React, { useRef, useEffect } from 'react';

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <h1>Simple Billiards Demo</h1>
      <canvas ref={canvasRef} width={800} height={600}></canvas>
    </div>
  );
};

export default App;
