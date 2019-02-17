export interface IWave {
  Draw: () => void;
  nodes: any[];
}

export default class Wave implements IWave {
  public nodes: any[];

  private color: string;
  private lambda: number;
  private ctx: CanvasRenderingContext2D;
  private tick: number;
  private start: number;

  constructor(color: string, lambda: number,
              nodes: number,
              ctx: CanvasRenderingContext2D,
              waveStart: number) {
    this.color = "#ffffff";
    this.lambda = lambda;
    this.ctx = ctx;
    this.nodes = [];
    this.tick = 1;
    this.start = waveStart;

    for (let i = 0; i <= nodes + 2; i++) {
      const tmp = [(i - 1) * this.ctx.canvas.width / nodes, 50, Math.random() * 200, .3];
      this.nodes.push(tmp);
    }
  }

  public Draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(this.nodes[0][0], this.nodes[0][1]);
    this.nodes.forEach((v, i) => {
      if (this.nodes[i + 1]) {
        this.ctx.quadraticCurveTo(
          this.nodes[i][0], this.nodes[i][1],
          this.diff(this.nodes[i][0], this.nodes[i + 1][0]),
          this.diff(this.nodes[i][1], this.nodes[i + 1][1]),
        );
      } else {
        this.ctx.lineTo(this.nodes[i][0], this.nodes[i][1]);
        this.ctx.lineTo(this.ctx.canvas.width, 0);
      }
    });
    this.ctx.closePath();
    this.ctx.fill();
  }

  private diff(a: number, b: number) {
    return (b - a) / 2 + a ;
  }
}
