const OGG_WORKER_PATH_GZIP = "/ogg/ogg_encoder_worker.js";

export interface IOGG {
  Write: (leftData: Float32Array, rightData: Float32Array, samplesCount: number) => void;
  Flush: () => void;
  Init: (sampleRate: number) => void;
  SetCallback: (done: (blob: Blob, duration: number) => void) => void;
}

export class OGG implements IOGG {
  private worker: Worker;
  private callback: (blob: Blob, duration: number) => void;
  private sampleRate: number;
  private start: Date;
  private duration: number;
  constructor() {
    // this.getWorker();
    this.worker = new Worker(OGG_WORKER_PATH_GZIP);

    this.worker.onmessage = (e) => {
      const blob = new Blob([new Uint8Array(e.data.buffer, 0, e.data.outputLength)], { type: "audio/ogg" });
      // console.log(blob, this.duration);
      this.callback(blob, this.duration);
      this.duration = 0;
    };
  }

  public SetCallback(done: (blob: Blob, duration: number) => void) {
    this.callback = done;
  }

  public Init(sampleRate: number) {
    this.sampleRate = sampleRate;
    this.worker.postMessage({
      cmd: "init",
      sampleRate,
    });
  }

  public Write(leftData: Float32Array, rightData: Float32Array, samplesCount: number) {
    if (!this.start) {
      this.start = new Date();
    }
    this.worker.postMessage({
      cmd: "write",
      leftData,
      rightData,
      samplesCount,
    });
  }

  public Flush() {
    this.duration = (new Date().getTime() / 1000) - (this.start.getTime() / 1000);
    this.worker.postMessage({cmd: "finish"});
    this.start = null;
  }

}
