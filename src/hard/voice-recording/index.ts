import {IRecorder, Recorder} from "./recorder";
import { IOGG, OGG } from "./ogg";

const constraints: { audio: boolean} = { audio: true};
let recorder: IRecorder = null;
let OGGEncoder: IOGG = new OGG();

interface INode {
  buf: ArrayBuffer;
  sync: number;
  retry: number;
}

const GET_USER_MEDIA_ERROR = "Get User Media Error";

interface IRecordError {
  errror: string;
}

const startRecording = async function(progress: (ampls: number) => void, error: (e: Error) => void) {
  let stream: MediaStream = null;
  if (!OGGEncoder) {
    OGGEncoder = new OGG();
  }
  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
  } catch (e) {
    error(e);
    return;
    // console.log("Fail");
  }
  if (stream === null) {
    error(Error("Failed got mediaDevices"));
    return;
  }
  const input = new AudioContext().createMediaStreamSource(stream);
  recorder = new Recorder(stream, input, progress, OGGEncoder);
  recorder.record();
};

const stopRecording = function() {
  if (recorder) {
    recorder.stop();
  }
};

const doneRecording = function(blobCallback: (data: {blob: Blob, duration: number}) => void) {
  if (recorder) {
    recorder.done(blobCallback);
  }
};

export {startRecording, stopRecording, doneRecording};
