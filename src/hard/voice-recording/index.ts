import {IRecorder, Recorder} from "./recorder";

const constraints: { audio: boolean} = { audio: true};
let recorder: IRecorder;

interface INode {
  buf: ArrayBuffer;
  sync: number;
  retry: number;
}

const startRecording = async function(progress: (ampls: number) => void) {
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  const input = new AudioContext().createMediaStreamSource(stream);
  recorder = new Recorder(input, progress);
  recorder.record();
};

const stopRecording = function() {
  recorder.stop();

};

export {startRecording, stopRecording};
