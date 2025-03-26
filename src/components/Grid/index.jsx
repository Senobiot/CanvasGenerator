import { useEffect, useRef, useState } from 'react';
import IsometricGrid from './Grid';

export default function Grid() {
  const canvasRef = useRef(null);
  const [size, setSize] = useState(5);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    const {
      left: canvasLeftBorder,
      top: canvasTopBorder,
      width,
    } = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');

    const grid = new IsometricGrid({
      ctx,
      cellSize: { w: 100, h: 50 },
      start: { x: width / 2, y: 0 },
      size,
    });

    grid.drawGrid();

    canvas.addEventListener('click', (event) => {
      const x = event.clientX - canvasLeftBorder;
      const y = event.clientY - canvasTopBorder;

      for (let index = 0; index < grid.cells.length; index++) {
        if (ctx.isPointInPath(grid.cells[index].path, x, y)) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          console.log(grid.cells[index]);
          grid.animateCell(grid.cells[index], canvas.width, canvas.height);
          // grid.moveCell(grid.cells[index].id);
          break;
        }
      }
    });
  }, [size]);

  const increaseSize = () => {
    setSize((prev) => prev + 1);
  };

  const decreaseSize = () => {
    setSize((prev) => prev - 1);
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={size * 100}
        height={(size * 100) / 2}
        style={{
          backgroundColor: 'white',
          border: '1px solid black',
        }}
      />
      <div className=''>
        <button
          style={{ backgroundColor: 'white', color: 'blue' }}
          onClick={increaseSize}
        >
          size+
        </button>
        <button
          style={{ backgroundColor: 'white', color: 'blue' }}
          onClick={decreaseSize}
        >
          size-
        </button>
      </div>
    </div>
  );
}
