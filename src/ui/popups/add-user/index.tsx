import * as React from "react";
import { observer, inject } from "mobx-react";
import { IRootStore } from "src/store/interfeces";
import languages from "src/language";
import { IChatUser } from "src/models/chat";
import AddUserrPopupItem from "./item";
import { IAnswerError } from "src/interfaces/api";
require("./styles.scss");

interface IAddUserPopupProps {
  store?: IRootStore;
}

interface IAddUserPopupState {
  input: string;
  users: IChatUser[];
  load: boolean;
}

@inject("store")
@observer
export default class AddUserPopup extends React.Component<IAddUserPopupProps, IAddUserPopupState> {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      users: [],
      load: false,
    };

    this.loadUsers = this.loadUsers.bind(this);
    this.pick = this.pick.bind(this);
    this.input = this.input.bind(this);
  }

  public loadUsers(input: string) {
    this.setState({load: false});
    new Promise(async (res, rej) => {
      const answer: IAnswerError | IChatUser[] = await this.props.store.chatStore.getUsersForAdd(input);
      if ((answer as IAnswerError).result !== "Error") {
        res(answer);
      } else {
        rej();
      }
    }).then((data: IChatUser[]) => {
      this.setState({
        load: true,
        users: data,
      });
    }, () => {
      this.setState({
        load: true,
        users: [],
      });
    });
  }

  public pick(id: number) {
    new Promise(async (res, rej) => {
      const answer: IAnswerError = await this.props.store.chatStore.addUserToChat(id);
      if (answer.result !== "Error") {res(); } else {rej(answer); }
    }).then(() => {
      this.loadUsers(this.state.input);
    }, (error) => {
      console.log(error);
    });
  }

  public input(e: React.FormEvent<HTMLInputElement>) {
    this.setState({
      input: (e.target as any).value,
    });
    this.loadUsers((e.target as any).value);
  }

  public render() {
    const lang = languages.get(this.props.store.userStore.data.lang).popups.addUsers;
    let users: JSX.Element[] = [];
    if (this.state.users.length === 0) {
      users.push(<div key={0} className="add-user-popup-notfound">{lang.notfound}</div>);
    } else {
      users = this.state.users.map((u, i) => <AddUserrPopupItem user={u} onClick={this.pick} key={i}/>);
    }
    return(
      <div className="add-user-popup">
        <div>
          <input
            className="add-user-popup__input"
            type="text"
            placeholder={lang.placeholder}
            value={this.state.input}
            onChange={this.input}
          />
        </div>
        <div className="add-user-popup__body">
          {users}
        </div>
      </div>
    );
  }
}
