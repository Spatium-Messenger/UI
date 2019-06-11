import { IDocumentUpload } from "src/models/document";
import { IAnswerError } from ".";

export interface IAPIFile {
  Upload: (
    file: IDocumentUpload,
    answer: (file: IDocumentUpload, err: boolean) => void,
    progress: (uploadedSize: number) => void,
  ) => void;

  Delete: (file: IDocumentUpload) => Promise<IAnswerError>;
  GetImage: (fileID: number, extension: string) => Promise<string>;
  Download: (fileID: number) => Promise<string>;
}
