import { IAPIMessages } from "src/interfaces/api/messages";
import APIClass, { IAPIClassCallProps } from "./remote.api.base";
import { IAPIData, IAnswerError } from "src/interfaces/api";
import { IMessage, IMessageType, IMessageContentDoc } from "src/models/message";
import { IIMessageServer } from "./interfaces";

const base = "/api/messages/";
export default class APIMessages extends APIClass implements IAPIMessages {
  constructor(data: IAPIData) {
    super(data);
  }

  public async Get(lastID: number, chatID: number): Promise<IAnswerError | IMessage[]> {
    const message: IAPIClassCallProps = super.GetDefaultMessage();
    message.uri = `${base}?chat=${chatID}`;
    if (lastID === -1) {
      message.uri += `&last=${lastID}`;
    }
    message.type = "GET";
    const messagesAnswer: IAnswerError | IIMessageServer[] = await super.Send(message);
    const messages: IMessage[] = [];
    if ((messagesAnswer as IAnswerError).result !== "Error") {
      (messagesAnswer as IIMessageServer[]).forEach((e: IIMessageServer) => {
        const docs: IMessageContentDoc[] = [];
        if (e.message.documents) {
          e.message.documents.forEach((d) => {
            docs.push({
              ID: d.id,
              Name: d.name,
              Path: d.path,
              Ratio: d.ratio,
              Size: d.size,
              AdditionalContentLoaded: false,
              Duration: d.duration,
            });
          });
        }
        messages.push({
          AuthorID: e.author_id,
          AuthorLogin: e.author_login,
          AuthorName: e.author_name,
          Content: {
            Documents: docs,
            Message: e.message.content,
            Type: e.message.type,
            Command: e.message.command,
          },
          Time: e.time,
          ChatID: e.chat_id,
          ID: e.id,
        });
      });
      return messages;
    } else {
      return (messagesAnswer as IAnswerError);
    }
  //
  }
}
