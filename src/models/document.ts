export interface IDocument {
  chatID: number;
  del: boolean;
  id: number;
  load: number;
  src: IDocumentSrc;
  type: string;
  url: string;
  width: number;
  height: number;
}

export interface IDocumentUpload {
  load: number;
  chatID: number;
  src: IDocumentSrc;
  url: string;
  width: number;
  height: number;
  id: number;
  del: boolean;
  key: string;
  uploadedSize: number;
}

interface IDocumentSrc {
  name: string;
  size: number;
  type: string;
}
