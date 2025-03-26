export default class IsometricGrid {
  constructor({ ctx, cellSize, start, size, color, borderWidth, shadow }) {
    this.ctx = ctx;
    this.cellWidth = cellSize.w;
    this.cellHeight = cellSize.h;
    this.cellHalfWidth = cellSize.w / 2;
    this.cellHalfHeigth = cellSize.h / 2;
    this.startX = start.x;
    this.startY = start.y;
    this.size = size;
    this.cells = [];
  }

  drawCell(x, y) {
    const cell = new Path2D();

    cell.moveTo(x, y);
    const rightX = x + this.cellHalfWidth;
    const rightY = y + this.cellHalfHeigth;

    cell.lineTo(rightX, rightY);

    const bottomX = x;
    const bottomY = y + this.cellHeight;

    cell.lineTo(bottomX, bottomY);
    const leftX = x - this.cellHalfWidth;
    const leftY = y + this.cellHalfHeigth;
    cell.lineTo(leftX, leftY);

    cell.closePath();

    cell.strokeStyle = this.color;
    cell.lineWidth = this.borderWidth;

    this.cells.push({ path: cell });
  }

  drawGrid() {
    this.cells = [];
    for (let row = 0; row < this.size; row++) {
      for (let item = 0; item <= row; item++) {
        const offsetX =
          this.cellHalfWidth * row - this.cellWidth * (row - item);
        this.drawCell(
          this.startX - offsetX,
          this.startY + this.cellHalfHeigth * row
        );

        if (row + 1 < this.size) {
          this.drawCell(
            this.startX - offsetX,
            this.startY +
              this.cellHalfHeigth * (2 * this.size - row - 1) -
              this.cellHalfHeigth
          );
        }
      }
    }

    this.cells.forEach((cell, index) => {
      cell.id = index;
      this.ctx.stroke(cell.path);
    });
  }

  animateCell(cell, width, height) {
    const startTime = performance.now();
    const startY = 0;
    const targetY = 10;

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / 250, 1);
      const newY = startY + (targetY - startY) * progress;
      cell.y = newY;

      this.ctx.clearRect(0, 0, width, height);
      this.cells.forEach((c) => {
        if (c === cell) {
          this.ctx.save();
          this.ctx.translate(0, -newY + startY);
          this.ctx.fillStyle = 'lightblue';
          this.ctx.fill(c.path);

          this.ctx.stroke(cell.path);
          this.ctx.restore();
          return;
        }
        this.ctx.stroke(c.path);
      });

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }

  moveCell(id) {
    this.cells.forEach((cell, index) => {
      if (id === index) {
        if (cell.isRaised) {
          cell.isRaised = false;
          this.ctx.stroke(cell.path);
          return;
        }
        this.ctx.save();
        this.ctx.translate(0, -10);
        this.ctx.fillStyle = 'lightblue';
        this.ctx.fill(cell.path);
        this.ctx.stroke(cell.path);
        this.ctx.restore();
        cell.isRaised = true;
        return;
      }

      if (cell.isRaised) {
        this.ctx.save();
        this.ctx.translate(0, -10);
        this.ctx.fillStyle = 'lightblue';
        this.ctx.fill(cell.path);
        this.ctx.stroke(cell.path);
        this.ctx.restore();
        return;
      }
      cell.id = index;
      this.ctx.stroke(cell.path);
    });
  }
}
