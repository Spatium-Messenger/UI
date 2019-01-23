import { observable, action} from "mobx";
// import { IAppStoreModule, IUser } from "../../../interfaces/app_state";
import {IInputStore, IUser, IInputData} from "src/interfaces/store";
import { IChat } from "src/models/chat";
import { IDocument, IDocumentUpload } from "src/models/document";

export default class InputStoreModule implements IInputStore {
  @observable public chatsInputData: {[key: string]: IInputData};

  constructor(rootStore: any) {
    this.chatsInputData = {
      1: {
        documents: [],
        text: "Hello",
      },
    };
  }

  @action
  public uploadDocuments(docs: IDocumentUpload[]): void {
    console.log(docs);
  }

}
