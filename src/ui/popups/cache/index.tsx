import * as React from "react";
import { observer, inject } from "mobx-react";
import { IRootStore } from "src/store/interfeces";
import languages from "src/language";
import { Button } from "src/ui/components";
require("./styles.scss");

interface ICachePopupProps {
  store?: IRootStore;
}

interface ICachePopupState {
  size: string;
}

@inject("store")
@observer
export default class CachePopup extends React.Component<ICachePopupProps, ICachePopupState> {
  constructor(props) {
    super(props);
    this.clear = this.clear.bind(this);
  }

  public componentWillMount() {
    this.setState({
      size: this.props.store.fileStore.getCacheSize(),
    });
  }

  public clear() {
    this.props.store.fileStore.clearCache();
    this.setState({
      size: this.props.store.fileStore.getCacheSize(),
    });
  }

  public render() {
    const lang = languages.get(this.props.store.userStore.data.lang).popups.cache;
    return(
      <div className="cache-popup">
        <div className="cache-popup__body modal-body">
          <div className="modal-header create-modal__header">
            {lang.header}
          </div>
          <div className="cache-popup__body__size">
            <div className="modal-text">{lang.size}</div>
            <div className="modal-text">{this.state.size}</div>
          </div>
        </div>
        <div className="cache-popup__bottom">
          <Button
            text={lang.clearButton}
            active={true}
            onClick={this.clear}
            loading={false}
          />
        </div>
      </div>
    );
  }
}
