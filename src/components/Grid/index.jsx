import { useEffect, useRef } from 'react';

export default function Grid() {
  const canvas = useRef(null);
  const cellCoordinates = [];
  function drawCell({ ctx, diags, startPosition, color, borderWidth, shadow }) {
    const { x, y } = startPosition;
    const { w, h } = diags;
    const halfX = w / 2;
    const halfY = h / 2;

    const vertices = [
      { x, y }, // Верхняя точка
      { x: x + halfX, y: y + halfY }, // Правая точка
      { x, y: y + h }, // Нижняя точка
      { x: x - halfX, y: y + halfY },
      { colored: false }, // Левая точка
    ];

    cellCoordinates.push(vertices); // До

    ctx.beginPath();
    ctx.moveTo(x, y);
    const rightX = x + halfX;
    const rightY = y + halfY;

    ctx.lineTo(rightX, rightY);

    const bottomX = x;
    const bottomY = y + h;

    ctx.lineTo(bottomX, bottomY);
    const leftX = x - halfX;
    const leftY = y + halfY;
    ctx.lineTo(leftX, leftY);
    ctx.closePath();

    // ctx.fillStyle = 'red';
    // ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = borderWidth;

    if (shadow) {
      console.log('?');
      ctx.shadowColor = 'rgba(4, 118, 133, 0.67)'; // Set the shadow color
      ctx.shadowBlur = 15; // Set the blur level of the shadow
      ctx.shadowOffsetX = 10; // Horizontal shadow offset
      ctx.shadowOffsetY = 15; // Vertical shadow offset
      ctx.fillStyle = 'white'; // Example fill color
      ctx.fill(); // Apply the shadow and fill the shape
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = 0;
    }

    ctx.stroke();
  }

  function drawGrid({ ctx, diags, startPosition, size }) {
    const { x, y } = startPosition;
    const halfDiagH = diags.h / 2;

    for (let row = 0; row < size; row++) {
      for (let item = 0; item <= row; item++) {
        const offsetX = (diags.w / 2) * row - diags.w * (row - item);
        drawCell({
          ctx,
          diags,
          startPosition: {
            x: x - offsetX,
            y: y + halfDiagH * row,
          },
        });
        if (row + 1 < size) {
          drawCell({
            ctx,
            diags,
            startPosition: {
              x: x - offsetX,
              y: y + halfDiagH * (2 * size - row - 1) - halfDiagH,
            },
            shadow: item === 0 || item === row ? true : false,
          });
        }
      }
    }
  }

  useEffect(() => {
    const ctx = canvas.current.getContext('2d');

    function isPointInRhombus(pointX, pointY, rhombusVertices) {
      const [top, right, bottom, left] = rhombusVertices;

      const angleSum =
        calculateAngle(pointX, pointY, top.x, top.y, right.x, right.y) +
        calculateAngle(pointX, pointY, right.x, right.y, bottom.x, bottom.y) +
        calculateAngle(pointX, pointY, bottom.x, bottom.y, left.x, left.y) +
        calculateAngle(pointX, pointY, left.x, left.y, top.x, top.y);

      return Math.abs(angleSum - 2 * Math.PI) < 0.01;
    }

    function calculateAngle(px, py, x1, y1, x2, y2) {
      const dx1 = x1 - px;
      const dy1 = y1 - py;
      const dx2 = x2 - px;
      const dy2 = y2 - py;

      const dotProduct = dx1 * dx2 + dy1 * dy2;
      const magnitude1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
      const magnitude2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

      return Math.acos(dotProduct / (magnitude1 * magnitude2));
    }

    const handleClick = (event) => {
      event.stopPropagation();
      const rect = canvas.current.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const clickedCellIndex = cellCoordinates.findIndex((vertices) =>
        isPointInRhombus(mouseX, mouseY, vertices)
      );

      if (clickedCellIndex !== -1) {
        const clickedCell = cellCoordinates[clickedCellIndex];
        clickedCell.colored = !clickedCell.colored;
        console.log(clickedCell);

        ctx.fillStyle = clickedCell.colored ? 'red' : 'white';
        ctx.beginPath();
        ctx.moveTo(clickedCell[0].x, clickedCell[0].y);
        clickedCell.forEach((vertex) => ctx.lineTo(vertex.x, vertex.y));
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        console.log('miss');
      }
    };

    canvas.current.addEventListener('click', handleClick);

    drawGrid({
      ctx,
      diags: { w: 100, h: 50 },
      startPosition: { x: canvas.current.width / 2, y: 0 },
      size: 5,
    });

    return () => {
      if (!canvas.current) {
        console.warn('Cleanup skipped: canvas reference is null');
        return;
      }
      canvas.current.removeEventListener('click', handleClick);
    };
  }, []);

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
    </div>
  );
}
