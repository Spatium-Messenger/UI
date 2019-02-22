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
    const lang = languages.get(this.props.store.userStore.data.lang);
    const CL = lang.popups.lang;
    const langs: ILanguage [] = [];
    for (const l of languages.keys()) {
      if (languages.get(l).id !== this.props.store.userStore.data.lang) {
        langs.push(languages.get(l));
      }
    }

    const langsEL: JSX.Element[] = langs.map((v, i) =>
      <div className="language-popup__item" key={i + 1} onClick={() => this.click(v.id)}>
        <div dangerouslySetInnerHTML={{__html: v.icon}}/>
        <div>{v.name}</div>
      </div>,
    );
    return(
      <div className="language-popup">
        <div className="cache-popup__header">
          {CL.header}
        </div>
        <div className="language-popup__body">
          <div className="language-popup__item-choosen" key={0}>
            <div dangerouslySetInnerHTML={{__html: lang.icon}}/>
            <div>{lang.name}</div>
          </div>
          {langsEL}
        </div>
      </div>
    );
  }
}
