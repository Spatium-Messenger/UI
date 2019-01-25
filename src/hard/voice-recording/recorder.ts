interface IRecorderConfig {
  buffLen: number;
  channels: number;
  type: string;
}

export interface IRecorder {
  record: () => void;
  stop: () => void;
}

const average = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;

export class Recorder implements IRecorder {
  private config: IRecorderConfig;
  private recording: boolean;
  private context: BaseAudioContext;
  private node: ScriptProcessorNode;

  constructor(src: MediaStreamAudioSourceNode, progress: (n: number) => void) {
    this.recording = false;
    this.context = src.context;
    this.config = {
      buffLen: 4096,
      channels: 2,
      type: "audio/wav",
    };

    this.node = this.context.createScriptProcessor.call(
      this.context,
      this.config.buffLen,
      this.config.channels,
      this.config.channels,
    );

    this.node.onaudioprocess = (e) => {
      if (!this.recording) { return; }

      const buffer = [];
      let newBuffer: Float32Array;
      for (let channel = 0; channel < this.config.channels; channel++) {
          buffer.push(e.inputBuffer.getChannelData(channel));
      }

      newBuffer = e.inputBuffer.getChannelData(0);
      newBuffer = newBuffer.filter((v) => (v >= 0 ? true : false));
      progress(((average(newBuffer) * 100).toFixed(0) as any));
      // console.log(buffer[0].length);
    };

    src.connect(this.node);
    this.node.connect(this.context.destination);
  }

  public record() {
    this.recording = true;
  }

  public stop() {
    this.recording = false;
  }
}
