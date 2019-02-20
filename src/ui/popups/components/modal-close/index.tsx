import * as React from "react";
import { observer, inject } from "mobx-react";
import { IRootStore } from "src/store/interfeces";
import { MODALS_ID } from "src/interfaces/store";
require("./styles.scss");

const closeIcon = require("assets/cancel.svg");

interface IModalCloseProps {
  store?: IRootStore;
}

@inject("store")
@observer
export default class ModalClose extends React.Component<IModalCloseProps> {
  constructor(props) {
    super(props);
    this.click = this.click.bind(this);
  }

  public click() {
    this.props.store.appStore.changeModal(MODALS_ID.NULL);
  }

  public render() {
    return(
      <div className="modal-close-wrapper">
        <div
          onClick={this.click}
          dangerouslySetInnerHTML={{__html: closeIcon}}
          className="modal-close"
        />
      </div>
    );
  }
}
