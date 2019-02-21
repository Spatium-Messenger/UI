import {IRecorder, Recorder} from "./recorder";

const constraints: { audio: boolean} = { audio: true};
let recorder: IRecorder = null;

interface INode {
  buf: ArrayBuffer;
  sync: number;
  retry: number;
}

const GET_USER_MEDIA_ERROR = "Get User Media Error";

interface IRecordError {
  errror: string;
}

const startRecording = async function(progress: (ampls: number) => void) {
  let stream: MediaStream = null;
  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
  } catch (e) {
    console.log("Fail");
  }
  if (stream === null) {
    return;
  }
  console.log(stream);
  // await new Promise((res, rej) => {
  //   await navigator.mediaDevices.getUserMedia(constraints);
  // }).then((newStream: MediaStream) => {stream = newStream; });
  const input = new AudioContext().createMediaStreamSource(stream);
  console.log(input);
  recorder = new Recorder(stream, input, progress);
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
