import { IAudioMessage } from "src/models/audio";

export interface IAPIAudio {
  Upload: (file: IAudioMessage,
           userID: number,
           answer: (file: IAudioMessage, err: boolean) => void,
           progress: (uploadedSize: number) => void) => void;
  Delete: (file: IAudioMessage) => void;
  Get: (fileID: number) => Promise<{duration: number, blob: Blob} | {result: string}>;
}
