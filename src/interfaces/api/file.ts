import { IDocumentUpload } from "src/models/document";

export interface IAPIFile {
  Upload: (
    file: IDocumentUpload,
    answer: (file: IDocumentUpload, err: boolean) => void,
    progress: (percentage: number) => void,
  ) => void;
}
