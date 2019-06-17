import * as React from "react";
import { observer, inject } from "mobx-react";
import { IRootStore } from "src/store/interfeces";
import languages from "src/language";
import { Button } from "src/ui/components";
import { MODALS_ID } from "src/interfaces/store";
require("./styles.scss");

interface IUserSettingsProps {
  store?: IRootStore;
}

interface IUserSettingsState {
  readonly name: string;
}

@inject("store")
@observer
export default class UserSettingsPopup extends React.Component<IUserSettingsProps, IUserSettingsState> {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.store.userStore.data.name,
    };
    this.onChange = this.onChange.bind(this);
    this.save = this.save.bind(this);
  }

  public render() {
    const lang = languages.get(this.props.store.userStore.data.lang).popups.userSettings;
    return(
      <div className="user_settings-popup">
        <div className="user_settings-popup__body modal-body">
          <div className="modal-header">
            {lang.header}
          </div>
          <div className="user_settings-popup__body__name">
            <div className="modal-text">{lang.name}</div>
            <input
              className="modal-input user_settings-popup__body__name__input"
              value={this.state.name}
              onChange={this.onChange}
            />
          </div>
        </div>
        <div className="user_settings-popup__bottom">
          <Button
            background="#363050"
            text={lang.saveButton}
            active={true}
            onClick={this.save}
            loading={false}
          />
        </div>
      </div>
    );
  }

  private save() {
    this.props.store.userStore.saveSettings(this.state.name);
    this.props.store.appStore.changeModal(MODALS_ID.NULL);
  }

  private onChange(eve: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      name: eve.target.value,
    });
  }
}
