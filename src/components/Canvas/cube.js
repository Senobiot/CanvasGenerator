export default class Cube {
  #scaleX = 1;
  #scaleY = 1;
  #scaleZ = 1;
  #scale = 1;
  #rotationX = 0;
  #rotationY = 0;
  #rotationZ = 0;

  constructor() {
    this.defaultVertices = [
      [
        // front
        new DOMPoint(-1, 1, 1),
        new DOMPoint(1, 1, 1),
        new DOMPoint(1, -1, 1),
        new DOMPoint(-1, -1, 1),
      ],
      [
        // top
        new DOMPoint(-1, 1, -1),
        new DOMPoint(1, 1, -1),
        new DOMPoint(1, 1, 1),
        new DOMPoint(-1, 1, 1),
      ],
      [
        // left
        new DOMPoint(-1, 1, -1),
        new DOMPoint(-1, 1, 1),
        new DOMPoint(-1, -1, 1),
        new DOMPoint(-1, -1, -1),
      ],
      [
        // right
        new DOMPoint(1, 1, 1),
        new DOMPoint(1, 1, -1),
        new DOMPoint(1, -1, -1),
        new DOMPoint(1, -1, 1),
      ],
      [
        // bottom
        new DOMPoint(-1, -1, 1),
        new DOMPoint(1, -1, 1),
        new DOMPoint(1, -1, -1),
        new DOMPoint(-1, -1, -1),
      ],
      [
        // rear
        new DOMPoint(1, 1, -1),
        new DOMPoint(-1, 1, -1),
        new DOMPoint(-1, -1, -1),
        new DOMPoint(1, -1, -1),
      ],
    ];
    this.cubeVertices = JSON.parse(JSON.stringify(this.defaultVertices));
  }

  set ScaleX(value) {
    this.#scaleX = value;
    this.updateVertices();
  }
  set ScaleY(value) {
    this.#scaleY = value;
    this.updateVertices();
  }
  set ScaleZ(value) {
    this.#scaleZ = value;
    this.updateVertices();
  }

  set Scale(scale) {
    this.#scale = scale;
  }
  get Scale() {
    return this.#scale;
  }

  set RotationX(angle) {
    this.#rotationX = angle;
  }
  get RotationX() {
    return this.#rotationX;
  }

  set RotationY(angle) {
    this.#rotationY = angle;
  }
  get RotationY() {
    return this.#rotationY;
  }

  set RotationZ(angle) {
    this.#rotationZ = angle;
  }
  get RotationZ() {
    return this.#rotationZ;
  }

  updateVertices() {
    this.cubeVertices = this.defaultVertices.map((face) =>
      face.map(
        (vertex) =>
          new DOMPoint(
            vertex.x * this.#scaleX,
            vertex.y * this.#scaleY,
            vertex.z * this.#scaleZ
          )
      )
    );
  }

  getFaceDepth(vertices) {
    return vertices.reduce((sum, v) => sum + v.z, 0) / vertices.length;
  }
  Render(ctx, rect) {
    ctx.save();
    ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
    // ctx.translate(rect.x + rect.width / 2, rect.y + rect.height / 2);
    ctx.translate(rect.x, rect.y);

    const matrix = new DOMMatrix();
    matrix.rotateSelf(this.RotationX, this.RotationY, this.RotationZ);
    matrix.scaleSelf(this.Scale, this.Scale, this.Scale);

    this.transformedFaces = this.cubeVertices.map((face) =>
      face.map((vertex) => matrix.transformPoint(vertex))
    );

    const faceColors = [
      'lightblue', // Front
      'green', // Top
      'lightblue', // Left
      'lightblue', // Right
      'lightblue', // Bottom
      'lightblue', // Rear
    ];

    const sortedFaces = this.transformedFaces
      .map((vertices, index) => ({
        vertices,
        color: faceColors[index],
        depth: this.getFaceDepth(vertices),
        faceIndex: index,
      }))
      .sort((a, b) => b.depth - a.depth);

    sortedFaces.forEach(({ vertices, color }) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(vertices[0].x, -vertices[0].y);
      vertices.slice(1).forEach((v) => ctx.lineTo(v.x, -v.y));
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'black';
      ctx.stroke();
    });

    ctx.restore();
  }
}
