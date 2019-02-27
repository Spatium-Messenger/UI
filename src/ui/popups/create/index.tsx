import * as React from "react";
import { observer, inject } from "mobx-react";
import { IRootStore } from "src/store/interfeces";
import {InputField, Button} from "src/ui/components";
import languages from "src/language";
import { MODALS_ID } from "src/interfaces/store";
require("./styles.scss");

const chatIcon = require("assets/support.svg");

interface ICreateProps {
  store?: IRootStore;
}

interface ICreateState {
  name: string;
}

@inject("store")
@observer
export default class Create extends React.Component<ICreateProps, ICreateState> {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
    };
    this.inputChange = this.inputChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  public inputChange(value: string) {
    this.setState({name: value});
  }

  public submit() {
    this.props.store.chatStore.createChat(this.state.name);
  }

  public render() {
    const modalID = this.props.store.appStore.modal;
    const langs = languages.get(this.props.store.userStore.data.lang).popups;
    const lang = (modalID === MODALS_ID.CREATE_CHAT ? langs.createChat : langs.createChannel);

    return(
      <div className="create-modal">
        <div className="modal-body">
          <div className="modal-header create-modal__header">{lang.header}</div>
          <div className="modal-text create-modal__text">{lang.paragraph}</div>
        </div>
        <div className="create-modal__bottom">
          <InputField
            tabindex={0}
            onChange={this.inputChange}
            className="create-modal__input"
            placeholder={lang.placeholder}
          />
          <Button
            tabindex={1}
            active={true}
            loading={false}
            onClick={this.submit}
            text={lang.button}
          />
         </div>
      </div>
    );
  }
}
