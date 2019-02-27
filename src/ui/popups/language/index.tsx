import * as React from "react";
import { observer, inject } from "mobx-react";
import { IRootStore } from "src/store/interfeces";
import languages from "src/language";
import { ILanguage } from "src/language/interface";
require("./styles.scss");

interface ILanguagePopupProps {
  store?: IRootStore;
}

@inject("store")
@observer
export default class LanguagePopup extends React.Component<ILanguagePopupProps> {
  constructor(props) {
    super(props);
    this.click = this.click.bind(this);
  }

  public click(id: string) {
    this.props.store.userStore.setLang(id);
  }
  public render() {
    const langID = this.props.store.userStore.data.lang;
    const langData = languages.get(langID);
    const CL = langData.popups.lang;
    const langs: ILanguage [] = [];
    for (const l of languages.keys()) {
        langs.push(languages.get(l));
    }

    const langsEL: JSX.Element[] = langs.map((v, i) =>
      <div
        tabIndex={i + 1}
        className={"language-popup__item" + (v.id === langID ? "-choosen" : "")}
        key={i + 1}
        onClick={() => this.click(v.id)}
        onKeyPress={() => this.click(v.id)}
      >
        <div dangerouslySetInnerHTML={{__html: v.icon}}/>
        <div>{v.name}</div>
      </div>,
    );
    return(
      <div className="language-popup">
        <div className="language-popup__body">
          <div className="modal-header language-popup__header">
            {langData.popups.lang.header}
          </div>
          {langsEL}
        </div>
      </div>
    );
  }
}
