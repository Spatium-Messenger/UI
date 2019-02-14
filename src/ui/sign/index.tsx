import * as React from "react";
import { observer, inject } from "mobx-react";
import WavesDraw, { IWavesDraw } from "./waves.draw";
import { IAppStore, IUserStore } from "src/interfaces/store";
import { IRootStore } from "src/store/interfeces";
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

  public Anon() {
    //
  }

  public render() {
    const header: string = (this.state.InOrUp ? "Sign Up" : "Sign In");
    const bottom: string = (this.state.InOrUp ? "Sign In" : "Sign Up");
    const button: string = (this.state.InOrUp ? "Start" : "Enter");
    return(
      <div className="sign">
        <div className="sign__canvas-wrapper">
          <canvas ref={this.canvas}/>
        </div>
        <img src="/assets/logo.png" alt="logo" className="sign__logo"/>
        <div className="sign__form">
          <div className="sign__form-header">
            <div>{header}</div>
            <div dangerouslySetInnerHTML={{__html: anonIcon}} onClick={this.Anon}/>
          </div>
          <div>
            <input
              type="text"
              className="sign__form-input"
              placeholder="Login"
              value={this.state.login}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({login: e.target.value})}
            />
            <input
              className="sign__form-input"
              placeholder="Pass"
              type="password"
              value={this.state.pass}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({pass: e.target.value})}
            />
          </div>
          <div className="sign__form-bottom">
            <div className="sign__form-bottom-signup" onClick={this.Change}>{bottom}</div>
            <button className="sign__form-bottom-button" onClick={this.ButtonClick}>{button}</button>
          </div>
        </div>
      </div>
    );
  }
}
