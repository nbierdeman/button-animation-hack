export default class Snow {
  constructor({ canvasElement, width = 50, height = 50 }) {
    this.canvas = canvasElement;
    this.width = this.canvas.width = width;
    this.height = this.canvas.height = height;

    this.ctx = this.canvas.getContext('2d');

    this.angle = 0;
    this.MAX_SNOWFLAKES = 50;
    this.snowflakes = this.createSnowflakes();
  }

  createSnowflakes() {
    const { width, height, MAX_SNOWFLAKES } = this;

    return new Array(MAX_SNOWFLAKES).fill(0).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 1,
      density: Math.random() + 1,
    }));
  }

  moveFlakes() {
    this.angle += 0.01;
    const { width, height, angle, snowflakes } = this;

    this.snowflakes = snowflakes.map((snowflake) => {
      const y = snowflake.y + Math.pow(snowflake.density, 2) + 1;
      const x = snowflake.x + Math.sin(angle) * 2;

      if (y > height) {
        // send the snowflake to the top to fall again
        return {
          x: Math.random() * width,
          y: 0,
          radius: snowflake.radius,
          density: snowflake.density,
        };
      }

      return {
        ...snowflake,
        x,
        y,
      };
    });
  }

  render() {
    const { ctx } = this;

    ctx.clearRect(0, 0, this.width, this.height);
    ctx.fillStyle = 'white';
    ctx.beginPath();

    this.snowflakes.forEach((snowflake) => {
      ctx.moveTo(snowflake.x, snowflake.y);
      ctx.arc(snowflake.x, snowflake.y, snowflake.radius, 0, Math.PI * 2, true);
    });

    ctx.fill();
    this.moveFlakes();
  }
}
