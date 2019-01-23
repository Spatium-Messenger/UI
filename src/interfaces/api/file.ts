import { IDocumentUpload } from "src/models/document";

export interface IAPIFile {
  Upload: (
    file: IDocumentUpload,
    answer: (file: IDocumentUpload, err: boolean) => void,
    progress: (uploadedSize: number) => void,
  ) => void;
}
