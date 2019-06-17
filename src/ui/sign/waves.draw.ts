import Wave from "./wave";
import Bubbles from "./bubbles";
import { clearInterval } from "timers";

export interface IWavesDraw {
  Draw: () => void;
}

export default class WavesDraw implements IWavesDraw {
  private ctx: CanvasRenderingContext2D;
  private cvs: HTMLCanvasElement;
  private waves: Wave[];
  private waveHeight: number;
  private color: string;
  private bubbles: Bubbles;
  private interval: NodeJS.Timeout;
  constructor(canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d");
    this.waves = [];
    this.waveHeight = 30;
    this.color = "#363050";
    this.cvs = canvas;
    this.Begin();
    this.bubbles = new Bubbles(this.ctx, 50, ["#AEB0B2", "#f7f8fa", "#28243d", "#bfbec4"]);
    this.interval = setInterval(this.Draw.bind(this), 16);
  }

  public Begin() {
    this.resizeCanvas();
    this.waves = [];
    for (let i = 0; i < 1; i++) {
      this.waves.push(
        new Wave(this.color, 1, 5, this.ctx, this.waveHeight));
    }
  }

  public Draw() {
    if (this.ctx.canvas.width !== window.innerWidth ||
      this.ctx.canvas.height !== window.innerHeight) {
        this.resizeCanvas();
        this.Begin();
        return;
      }
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(0, 0, this.cvs.width, this.cvs.height);
    // this.ctx.fillRect(0, this.waveHeight, this.cvs.width, this.cvs.height);
    this.bubbles.Draw();
    this.waves.forEach((w) => {
      w.nodes.forEach((n) => {
        this.bounce(n);
      });
      w.Draw();
    });
  }

  private bounce(node: number[]) {
    node[1] = this.waveHeight / 2 *  Math.sin(node[2] / 20) + this.waveHeight / 2;
    node[2] = node[2] + node[3];
  }

  private resizeCanvas() {
    this.ctx.canvas.width = window.innerWidth;
    this.ctx.canvas.height = window.innerHeight;
  }

}
