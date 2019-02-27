import * as React from "react";
import { observer, inject } from "mobx-react";
import WavesDraw, { IWavesDraw } from "./waves.draw";
import { IAppStore, IUserStore } from "src/interfaces/store";
import { IRootStore } from "src/store/interfeces";
import { ILanguage } from "src/language/interface";
import languages from "src/language";
require("./styles.scss");

const anonIcon = require("assets/user.svg");

interface ISignProps {
  store?: IRootStore;
}

interface ISignState {
  InOrUp: boolean;
  login: string;
  pass: string;
}

@inject("store")
@observer
export default class Sign extends React.Component<ISignProps, ISignState> {
  private canvas: React.RefObject<HTMLCanvasElement>;
  private waves: IWavesDraw;
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.state = {
      InOrUp: false,
      login: "",
      pass: "",
    };
    this.ButtonClick = this.ButtonClick.bind(this);
    this.Change = this.Change.bind(this);
    this.Anon = this.Anon.bind(this);
    this.Language = this.Language.bind(this);
  }

  public componentDidMount() {
    this.waves = new WavesDraw(this.canvas.current);
  }

  public async componentWillMount() {
    const u = await this.props.store.userStore.checkUserWasSignIn();
  }

  public ButtonClick() {
    if (!this.state.InOrUp) {
      this.props.store.userStore.enter(this.state.login, this.state.pass);
    } else {
      this.props.store.userStore.create(this.state.login, this.state.pass);
    }
  }

  public Change() {
    this.setState({
      InOrUp: !this.state.InOrUp,
    });
  }

  public Language(lang: string) {
    this.props.store.userStore.setLang(lang);
  }

  public Anon() {
    //
  }

  public render() {
    const lang: ILanguage = languages.get(this.props.store.userStore.data.lang);
    const langs: ILanguage[] = [];
    for (const l of languages.keys()) {
      if (languages.get(l).id !== this.props.store.userStore.data.lang) {
        langs.push(languages.get(l));
      }
    }

    const header: string = (this.state.InOrUp ? lang.sign.up : lang.sign.in);
    const bottom: string = (this.state.InOrUp ? lang.sign.in : lang.sign.up);
    const button: string = (this.state.InOrUp ? lang.sign.start : lang.sign.enter);

    const langsEl: JSX.Element[] = langs.map((l, i) =>
      <div
        onClick={() => this.Language(l.id)}
        key={i}
        className="sign-lang-item"
      >
        <div dangerouslySetInnerHTML={{__html: l.icon}}/>
        <div>{l.name}</div>
      </div>);
    return(
      <div className="sign">
        <div className="sign__canvas-wrapper">
          <canvas ref={this.canvas}/>
        </div>
        <div className="sign__lang">
          <div className="sign-lang-item">
            <div dangerouslySetInnerHTML={{__html: lang.icon}}/>
            <div>{lang.name}</div>
          </div>
          <div className="sign__lang__content">
            {langsEl}
          </div>
        </div>
        <img src="/assets/logo.png" alt="logo" className="sign__logo"/>
        <div className="sign__form">
          <div className="sign__form-header">
            <div>{header}</div>
            <div
              dangerouslySetInnerHTML={{__html: anonIcon}}
              onClick={this.Anon}
              data-anon={lang.sign.anon}
            />
          </div>
          <div>
            <input
              type="text"
              className="sign__form-input"
              placeholder={lang.sign.input.login}
              value={this.state.login}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({login: e.target.value})}
            />
            <input
              className="sign__form-input"
              placeholder={lang.sign.input.pass}
              type="password"
              value={this.state.pass}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({pass: e.target.value})}
            />
          </div>
          <div className="sign__form-bottom">
            <button className="sign__form-bottom-signup" onClick={this.Change}>{bottom}</button>
            <button className="sign__form-bottom-button" onClick={this.ButtonClick}>{button}</button>
          </div>
        </div>
      </div>
    );
  }
}
