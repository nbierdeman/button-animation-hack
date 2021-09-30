export default class Snow {
  MAX_SNOWFLAKES = 50;

  constructor({ canvasElement, width = 50, height = 50 }) {
    this.canvas = canvasElement;
    this.width = this.canvas.width = width;
    this.height = this.canvas.height = height;

    this.ctx = this.canvas.getContext('2d');

    this.angle = 0;
    this.snowflakes = this.createSnowflakes();
  }

  createSnowflakes = () => {
    return new Array(this.MAX_SNOWFLAKES).fill(0).map(() => {
      return {
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 2 + 1,
        density: Math.random() + 1,
      };
    });
  };

  moveFlakes = () => {
    this.angle += 0.01;

    this.snowflakes.forEach((snowflake, index) => {
      snowflake.y += Math.pow(snowflake.density, 2) + 1;
      snowflake.x += Math.sin(this.angle) * 2;

        if (snowflake.y > this.height) {
          // send the snowflake to the top to fall again
          this.snowflakes[index] = {
            x: Math.random() * this.width,
            y: 0,
            radius: snowflake.radius,
            density: snowflake.density,
          };
        }
    })
  };

  render = () => {
    const { ctx } = this;

    ctx.clearRect(0, 0, this.width, this.height);
    ctx.fillStyle = 'white';
    ctx.beginPath();

    this.snowflakes.forEach((snowflake) => {
      ctx.moveTo(snowflake.x, snowflake.y);
      ctx.arc(snowflake.x, snowflake.y, snowflake.radius, 0, Math.PI * 2, true);
    })

    ctx.fill();
    this.moveFlakes();
  };
}
