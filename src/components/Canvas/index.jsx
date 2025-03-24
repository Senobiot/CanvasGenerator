import { useEffect, useRef, useState } from 'react';
import Cube from './cube';

const Canvas = () => {
  const initialPosition = { x: 100, y: 100, z: 0, scale: 50 };
  const [cube, setCube] = useState(null);
  const [position, setPosition] = useState(initialPosition);
  const canvas = useRef(null);

  const handleInputChange = (axis, reset) => (event) => {
    if (reset) {
      return setPosition((prev) => ({
        ...prev,
        [axis]: initialPosition[axis],
      }));
    }

    const value = parseFloat(event.target.value, 10);
    setPosition((prev) => ({
      ...prev,
      [axis]: value,
    }));
  };

  const drawCube = (ctx) => {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
    const cube = new Cube();

    cube.RotationX = position.x;
    cube.RotationY = position.y;
    cube.RotationZ = position.z;
    cube.Scale = position.scale;

    cube.Render(ctx, { x: 0, y: 0, width: 400, height: 400 });
    setCube(cube);
  };

  useEffect(() => {
    const ctx = canvas.current.getContext('2d');
    drawCube(ctx);
  }, [position]);

  useEffect(() => {
    const canvasEl = canvas.current;
    const ctx = canvasEl.getContext('2d');

    const handleCanvasClick = (event) => {
      const rect = canvas.current.getBoundingClientRect();
      const scale = window.devicePixelRatio || 1;

      const clickX = (event.clientX - rect.left) * scale;
      const clickY = (event.clientY - rect.top) * scale;
      console.log(clickX, clickY);

      const adjustedX = (clickX - rect.width / 2) / cube.Scale;
      const adjustedY = -(clickY - rect.height / 2) / cube.Scale;
      console.log(adjustedX, adjustedY);
      let clickedFace = null;

      cube.transformedFaces.forEach((vertices, index) => {
        ctx.beginPath();

        ctx.moveTo(vertices[0].x, -vertices[0].y);
        vertices.slice(1).forEach((vertex) => ctx.lineTo(vertex.x, -vertex.y));
        ctx.closePath();

        if (ctx.isPointInPath(adjustedX, adjustedY)) {
          console.log(`Клик по грани ${index}`);
          clickedFace = index;

          ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
          ctx.fill();
        }
      });

      if (clickedFace === null) {
        console.log('Клик не попал на грани');
      } else {
        console.log(`Грань ${clickedFace} была кликнута`);
      }
    };

    canvasEl.addEventListener('click', handleCanvasClick);

    return () => {
      canvasEl.removeEventListener('click', handleCanvasClick);
    };
  }, [cube]);

  return (
    <div>
      <canvas
        ref={canvas}
        width='500'
        height='500'
        style={{
          backgroundColor: 'white',

          border: '1px solid black',
        }}
      />
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h3 style={{ textAlign: 'center', color: '#fff' }}>Adjust Position</h3>
        <div style={{ margin: '10px 0' }}>
          <label style={{ marginRight: '10px', color: 'blue' }}>X:</label>
          <input
            type='range'
            min='-100'
            max='100'
            value={position.x}
            onChange={handleInputChange('x')}
            style={{ width: '80%', accentColor: 'blue' }}
          />
          <span style={{ marginLeft: '10px' }}>{position.x}</span>
        </div>
        <div style={{ margin: '10px 0' }}>
          <label style={{ marginRight: '10px', color: 'green' }}>Y:</label>
          <input
            type='range'
            min='-100'
            max='100'
            value={position.y}
            onChange={handleInputChange('y')}
            style={{ width: '80%', accentColor: 'green' }}
          />
          <span style={{ marginLeft: '10px' }}>{position.y}</span>
        </div>
        <div style={{ margin: '10px 0' }}>
          <label style={{ marginRight: '10px', color: 'red' }}>Z:</label>
          <input
            type='range'
            min='-100'
            max='100'
            value={position.z}
            onChange={handleInputChange('z')}
            style={{ width: '80%', accentColor: 'red' }}
          />
          <span style={{ marginLeft: '10px' }}>{position.z}</span>
        </div>
        <div style={{ margin: '10px 0' }}>
          <label style={{ marginRight: '10px', color: 'white' }}>S:</label>
          <input
            type='range'
            min='0'
            max='2'
            step='0.1'
            value={position.scale}
            onChange={handleInputChange('scale')}
            style={{ width: '60%', accentColor: 'white' }}
          />
          <span style={{ marginLeft: '10px' }}>{position.scale}</span>
          <button onClick={handleInputChange('scale', 'reset')}>Reset</button>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
