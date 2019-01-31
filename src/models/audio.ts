export interface IAudioMessage {
  chatID: number;
  src: {
    blob: Blob,
    duration: number,
  };
  load: number;
}
