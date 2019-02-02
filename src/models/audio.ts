export interface IAudioMessage {
  chatID: number;
  src: {
    blob: Blob,
    duration: number,
  };
  load: number;
  uploaded: number;
  abortLoad: () => void;
  fileID: number;
  del: boolean;
}
