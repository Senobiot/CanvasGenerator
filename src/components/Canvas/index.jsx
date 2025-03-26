import { useEffect, useRef, useState } from 'react';
import Cube from './cube';

const Canvas = () => {
  const initialPosition = {
    width: 500,
    height: 500,
    x: 80, // 0 + s
    y: 65,
    aX: -10,
    aY: -30,
    aZ: 0,
    s: 50,
  };
  const [cube, setCube] = useState(null);
  const [cubes, setCubes] = useState([initialPosition]);
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
    if (cubes.length < 2) {
      const cube = new Cube();
      cube.RotationX = position.aX;
      cube.RotationY = position.aY;
      cube.RotationZ = position.aZ;
      cube.Scale = position.s;

      cube.Render(ctx, {
        x: position.x,
        y: position.y,
        width: position.width,
        height: position.height,
      });

      newCube.rotateY(45);
      newCube.drawCube(ctx);
      return;
    }

    cubes.forEach((item) => {
      const cube = new Cube();
      console.log(item);
      cube.RotationX = item.aX;
      cube.RotationY = item.aY;
      cube.RotationZ = item.aZ;
      cube.Scale = item.s;

      cube.Render(ctx, {
        x: item.x,
        y: item.y,
        width: item.width,
        height: item.height,
      });
    });
  };

  useEffect(() => {
    const ctx = canvas.current.getContext('2d');
    drawCube(ctx);
  }, [position]);

  useEffect(() => {
    const canvasEl = canvas.current;

    const handleCanvasClick = (event) => {
      const { clientX, clientY } = event;
      const { left, top } = canvas.current.getBoundingClientRect();
      const clickX = clientX - left;
      const clickY = clientY - top;

      const newCube = { ...initialPosition, x: clickX, y: clickY };
      setCubes((prevCubes) => [...prevCubes, newCube]);
    };

    canvasEl.addEventListener('click', handleCanvasClick);

    return () => {
      canvasEl.removeEventListener('click', handleCanvasClick);
    };
  }, []);

  useEffect(() => {
    const ctx = canvas.current.getContext('2d');
    drawCube(ctx);
  }, [cubes]);

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
            value={position.aX}
            onChange={handleInputChange('aX')}
            style={{ width: '80%', accentColor: 'blue' }}
          />
          <span style={{ marginLeft: '10px' }}>{position.aX}</span>
        </div>
        <div style={{ margin: '10px 0' }}>
          <label style={{ marginRight: '10px', color: 'green' }}>Y:</label>
          <input
            type='range'
            min='-100'
            max='100'
            value={position.aY}
            onChange={handleInputChange('aY')}
            style={{ width: '80%', accentColor: 'green' }}
          />
          <span style={{ marginLeft: '10px' }}>{position.aY}</span>
        </div>
        <div style={{ margin: '10px 0' }}>
          <label style={{ marginRight: '10px', color: 'red' }}>Z:</label>
          <input
            type='range'
            min='-100'
            max='100'
            value={position.aZ}
            onChange={handleInputChange('aZ')}
            style={{ width: '80%', accentColor: 'red' }}
          />
          <span style={{ marginLeft: '10px' }}>{position.aZ}</span>
        </div>
        <div style={{ margin: '10px 0' }}>
          <label style={{ marginRight: '10px', color: 'white' }}>S:</label>
          <input
            type='range'
            min='10'
            max='100'
            step='1'
            value={position.s}
            onChange={handleInputChange('s')}
            style={{ width: '60%', accentColor: 'white' }}
          />
          <span style={{ marginLeft: '10px' }}>{position.s}</span>
          <button onClick={handleInputChange('s', 'reset')}>Reset</button>
        </div>
      </div>
    </div>
  );
};

export default Canvas;

const newCube = {
  vertices: [
    { x: -50, y: -50, z: -50 },
    { x: 50, y: -50, z: -50 },
    { x: 50, y: 50, z: -50 },
    { x: -50, y: 50, z: -50 },
    { x: -50, y: -50, z: 50 },
    { x: 50, y: -50, z: 50 },
    { x: 50, y: 50, z: 50 },
    { x: -50, y: 50, z: 50 },
  ],
  edges: [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
  ],

  project(vertex) {
    const distance = 200;
    const perspective = distance / (distance - vertex.z);
    return {
      x: vertex.x * perspective + 500 / 2,
      y: vertex.y * perspective + 500 / 2,
    };
  },

  rotateY(angle) {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    this.vertices.forEach((v) => {
      const x = v.x * cos - v.z * sin;
      const z = v.x * sin + v.z * cos;
      v.x = x;
      v.z = z;
    });
  },
  drawCube(ctx) {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.edges.forEach(([startIdx, endIdx]) => {
      const start = this.project(this.vertices[startIdx]);
      const end = this.project(this.vertices[endIdx]);
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    });
  },
};
