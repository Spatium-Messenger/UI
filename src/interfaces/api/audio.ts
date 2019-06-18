import { IAudioUpload } from "src/models/audio";

export interface IAPIAudio {
  Upload: (file: IAudioUpload,
           userID: number,
           answer: (file: IAudioUpload, err: boolean) => void,
           progress: (uploadedSize: number) => void) => void;
  Delete: (file: IAudioUpload) => void;
  Get: (fileID: number) => Promise<{duration: number, blob: Blob} | {result: string}>;
  GetLink: (fileID: number) => Promise<{link: string, timeoff: number} | {result: string}>;
}
