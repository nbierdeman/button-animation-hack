export default class Canvas {
  constructor({ canvasElement, song, width = 50, height = 50 }) {
    this.canvas = canvasElement;
    this.song = song;
    this.width = width;
    this.height = height;

    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = width;
    this.canvas.height = height;
    this.lastNoteProcessed = -1;
  }

  drawSnowMan(dancingAngle = 1) {
    const { ctx } = this;

    // kill old snowman RIP
    ctx.clearRect(0, 0, this.width, this.height);

    function drawCircle(color, x, y, radius) {
      ctx.strokeStyle = ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    }

    function drawTriangle(color, x, y, height) {
      ctx.strokeStyle = ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - height, y - height);
      ctx.lineTo(x + height, y - height);
      ctx.fill();
    }

    function drawRectangle(color, x, y, width, height) {
      ctx.strokeStyle = ctx.fillStyle = color;
      ctx.fillRect(x, y, width, height);
    }

    function drawLine(color, x1, y1, angle, length) {
      const x2 = x1 + Math.cos((Math.PI / 180.0) * angle - 90) * length;
      const y2 = y1 + Math.sin((Math.PI / 180.0) * angle - 90) * length;

      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);

      ctx.strokeStyle = color;
      ctx.stroke();
    }

    // draw body
    drawCircle('#FFFF00', 25, 35, 10);
    drawCircle('#FFFF00', 25, 20, 7);
    drawCircle('#FFFF00', 25, 10, 5);

    // draw eyes
    drawCircle('#000', 23, 9, 0.6);
    drawCircle('#000', 27, 9, 0.6);

    // new arms
    drawLine('#000', 18, 20, 180 * dancingAngle, -10);
    drawLine('#000', 32, 20, 1200 * dancingAngle, 10);

    // draw buttons
    drawCircle('#000', 200, 160, 3);
    drawCircle('#000', 200, 200, 3);
    drawCircle('#000', 200, 240, 3);

    // nose
    drawTriangle('#FFA500', 25, 12, 2);

    // hat
    drawRectangle('#555454', 160, 45, 80, 10);
    drawRectangle('#555454', 170, 5, 60, 40);
  }

  makeSnowManDance() {
    const multiplier = Math.random() + 1;
    this.drawSnowMan(multiplier);
  }
}
