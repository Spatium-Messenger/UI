import * as React from "react";
import { observer, inject } from "mobx-react";
import { IRootStore } from "src/store/interfeces";
import { MODALS_ID } from "src/interfaces/store";
import Create from "./create";
import AddUserPopup from "./add-user";
import Cache from "./cache";
import LanguagePopup from "./language";
import UserSettingsPopup from "./user-settings";
import languages from "src/language";
require("./styles.scss");

const closeIcon = require("assets/cancel.svg");

interface IModalsProps {
  store?: IRootStore;
}

@inject("store")
@observer
export default class Modals extends React.Component<IModalsProps> {
  private modalBack: React.RefObject<HTMLDivElement>;
  private closeRef: React.RefObject<HTMLDivElement>;
  constructor(props) {
    super(props);
    this.close = this.close.bind(this);
    this.modalBack = React.createRef();
    this.closeRef = React.createRef();
  }

  public close(e: React.MouseEvent<HTMLDivElement>) {
    // if ((e.target as HTMLDivElement) === this.modalBack.current ||
    // (e.target as HTMLDivElement) === this.closeRef.current) {
    //   this.props.store.appStore.changeModal(MODALS_ID.NULL);
    // }
    this.props.store.appStore.changeModal(MODALS_ID.NULL);
  }

  public render() {
    if (this.props.store.appStore.modal === MODALS_ID.NULL) {
      return(
        <div/>
      );
    }
    let content: JSX.Element = <div/>;
    const popupsLang = languages.get(this.props.store.userStore.data.lang).popups;
    switch (this.props.store.appStore.modal) {
      case MODALS_ID.CREATE_CHAT:
      case MODALS_ID.CREATE_CHANNEL:
        content = <Create/>;
        break;
      case MODALS_ID.ADD_USERS:
        content = <AddUserPopup/>;
        break;
      case MODALS_ID.CACHE:
        content = <Cache/>;
        break;
      case MODALS_ID.LANGUAGE:
        content = <LanguagePopup/>;
        break;
      case MODALS_ID.USER_SETTINGS:
        content = <UserSettingsPopup/>;
        break;
      default:
        content = <div>Modal didn't found</div>;
        break;
    }
          /* <div className="modal__header">
            <div>{header}</div>
           <ModalClose/>
          </div>
          <div className="modal__body"> */
    return(
      <div className="modal_wrapper">
        <div
          className="modal-back"
          onClick={this.close}
          ref={this.modalBack}
        >
          <div
            onClick={this.close}
            ref={this.closeRef}
            className="modal-back__close"
            dangerouslySetInnerHTML={{__html: closeIcon}}
          />
        </div>
        <div className="modal">
            {content}
          </div>
      </div>
    );
  }
}
