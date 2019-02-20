import InlineWorker from "inline-worker";
import {worker} from "./recorder-wroker";
interface IRecorderConfig {
  buffLen: number;
  channels: number;
  type: string;
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
  private worker: InlineWorker;
  private audiosourcenode: MediaStreamAudioSourceNode;
  private callbacks: {
    getBuffer: any[];
    exportWAV: any[];
  };

  constructor(src: MediaStreamAudioSourceNode, progress: (n: number) => void) {

    this.audiosourcenode = src;
    this.audiosourcenode.mediaStream.stop = function() {
      this.getTracks().forEach(function(track) {
          track.stop();
      });
    };

    this.recording = false;
    this.context = src.context;
    this.config = {
      buffLen: 4096,
      channels: 1,
      type: "audio/wav",
    };

    this.node = this.context.createScriptProcessor.call(
      this.context,
      this.config.buffLen,
      this.config.channels,
      this.config.channels,
    );

    this.callbacks = {
      getBuffer: [],
      exportWAV: [],
    };

    const blob = new Blob([`${worker.toString()}; ${worker.name}(self);`]);
    this.worker = new Worker(window.URL.createObjectURL(blob));

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
      this.worker.postMessage({
          command: "record",
          buffer,
      });
    };

    src.connect(this.node);
    this.node.connect(this.context.destination);
    this.worker.postMessage({
      command: "init",
      config: {
          sampleRate: this.context.sampleRate,
          numChannels: this.config.channels,
      },
    });

    this.worker.onmessage = (e) => {
      if (e.data.command === "exportWAV") {
          (this.callbacks.exportWAV.pop())(e.data.data);
      }
    };
  }

  public record() {
    this.recording = true;
  }

  public stop() {
    this.audiosourcenode.mediaStream.getTracks().forEach(function(track) {
      track.stop();
    });
    this.recording = false;
  }

  public done(blobCallback: (data: {blob: Blob, duration: number}) => void) {
    this.callbacks.exportWAV.push(blobCallback);
    this.audiosourcenode.mediaStream.getTracks().forEach(function(track) {
      track.stop();
    });
    this.recording = false;
    this.worker.postMessage({
      command: "exportWAV",
      type: this.config.type,
    });
    this.worker.postMessage({
      command: "clear",
    });
  }
}
