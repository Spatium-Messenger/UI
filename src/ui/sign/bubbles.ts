interface IBubbles {
  Draw: () => void;
}

interface IBubble {
  color: string;
  x: number;
  y: number;
  velocity: number;
  radius: number;
}

export default class Bubbles implements IBubbles {
  private cvs: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private bubbles: IBubble[];
  private colors: string[];
  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D,
              bubblesCount: number, colors: string[]) {
    this.cvs = canvas;
    this.ctx = context;
    this.bubbles = [];
    this.colors = colors;
    for (let i = 0; i < bubblesCount; i++) {
        this.bubbles.push(this.createBubble(Math.random() * this.cvs.height));
    }
  }

  public Draw() {
    this.bubbles = this.bubbles.map((v) => {
      const swingAxis = Math.sin(v.y / 20);
      const p = this.ctx.getImageData(v.x, v.y - v.velocity * 3, 1, 1).data;
      if (p[0] === 0 && p[1] === 0 && p[2] === 0) {
        return this.createBubble(this.cvs.height);
      }
      this.ctx.beginPath();
      // this.ctx.lineWidth = 5;
      // this.ctx.strokeStyle = v.color;
      this.ctx.fillStyle = v.color;
      this.ctx.arc(v.x + swingAxis * 2 , v.y, v.radius , 0, Math.PI * 2 , false);
      // this.ctx.stroke();
      this.ctx.fill();
      this.ctx.closePath();
      v.y -= v.velocity;
      if (v.y <= 0) {
       return this.createBubble(this.cvs.height);
        // console.log("New bubble", v, this.ctx.fillStyle);
      }
      return v;
    });

  }

  private createBubble(start: number): IBubble {
    const bubble: IBubble = {
      y: start,
      x: Math.random() * this.cvs.width,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      velocity: Math.random(),
      radius: Math.floor(Math.random() * 5),
    };
    return bubble;
  }
}
