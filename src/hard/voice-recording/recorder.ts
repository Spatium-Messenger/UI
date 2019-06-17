import { IOGG} from "./ogg";
interface IRecorderConfig {
  buffLen: number;
  channels: number;
}

export interface IRecorder {
  record: () => void;
  stop: () => void;
  done: (blobCallback: (data: {blob: Blob, duration: number}) => void) => void;
}

const average = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;

export class Recorder implements IRecorder {
  private config: IRecorderConfig;
  private recording: boolean;
  private context: BaseAudioContext;
  private node: ScriptProcessorNode;
  private OGGEncoder: IOGG;
  private mediaStream: MediaStream;

  constructor(
    mediaStream: MediaStream,
    src: MediaStreamAudioSourceNode,
    progress: (n: number) => void,
    ogg: IOGG) {

    this.OGGEncoder = ogg;
    this.mediaStream = mediaStream;
    this.mediaStream.stop = function() {
        this.getTracks().forEach(function(track) {
          track.stop();
        });
    };

    this.recording = false;
    this.context = src.context;
    this.config = {
      buffLen: 4096,
      channels: 2,
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
      this.OGGEncoder.Write(
        e.inputBuffer.getChannelData(0),
        e.inputBuffer.getChannelData(1),
        e.inputBuffer.getChannelData(0).length,
      );
    };

    src.connect(this.node);
    this.node.connect(this.context.destination);
    this.OGGEncoder.Init(this.context.sampleRate);
  }

  public record() {
    this.recording = true;
  }

  public stop() {
    this.mediaStream.getTracks().forEach(function(track) {
      track.stop();
    });
    this.recording = false;
  }

  public done(blobCallback: (data: {blob: Blob, duration: number}) => void) {
    this.OGGEncoder.SetCallback((blob, dur) => blobCallback({blob, duration: dur}));
    this.mediaStream.getTracks().forEach(function(track) {
      track.stop();
    });
    this.recording = false;
    this.OGGEncoder.Flush();
  }
}
