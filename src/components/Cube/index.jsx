import { useEffect, useRef, useState } from 'react';
import Cube from './cube';

const CubeGenerator = () => {
  const initialPosition = {
    width: 500,
    height: 500,
    x: 200,
    y: 200,
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
        width='400'
        height='400'
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

export default CubeGenerator;
