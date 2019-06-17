import { IAnswerError } from ".";
import { IMessage } from "src/models/message";

export interface IAPIMessages {
  Get: (lastID: number, chatID: number) => Promise<IAnswerError | IMessage[]>;
}
