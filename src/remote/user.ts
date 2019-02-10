import APIClass, { IAPIClassCallProps } from "./remote.api.base";
import { IAPIUser } from "src/interfaces/api/user";
import { IAPIData } from "src/interfaces/api";

export class APIUser extends APIClass implements IAPIUser {
  private enterURL: string;
  private proveToeknURL: string;
  private createUserURL: string;
  private getMyDataURL: string;
  private getSettingsURL: string;
  private setSettingsURL: string;
  constructor(data: IAPIData) {
    super(data);
    const p: string = "/api/user/";
    this.enterURL = p + "enter";
    this.proveToeknURL = p + "testToken";
    this.createUserURL = p + "create";
    this.getMyDataURL = p + "myData";
    this.getSettingsURL = p + "getSettings";
    this.setSettingsURL = p + "setSettings";

  }

  public async Enter(login: string, pass: string): Promise<{result: string}> {
    const message: IAPIClassCallProps = super.GetDefaultMessage();
    message.uri = this.enterURL;
    message.payload = {
      login,
      pass,
    };
    const answer: {result: string} = await super.Send(message);
    return answer;
  }
  public async ProveToken(): Promise<void> {
    //
  }
  public async CreateUser(login: string, pass: string): Promise<{result: string}> {
    const message: IAPIClassCallProps = super.GetDefaultMessage();
    message.uri = this.createUserURL;
    message.payload = {
      login,
      pass,
    };
    const answer: {result: string} = await super.Send(message);
    return answer;
  }
  public async GetMyData(): Promise<{result: string}> {
    const message: IAPIClassCallProps = super.GetDefaultMessage();
    message.uri = this.getMyDataURL;
    const answer: {result: string} = await super.Send(message);
    return answer;
  }
  public async GetSettings(): Promise<void> {
    //
  }
  public async SetSettings(name: string): Promise<void> {
    //
  }

}
