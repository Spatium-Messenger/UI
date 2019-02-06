import * as React from "react";
import { observer, inject } from "mobx-react";
import WavesDraw, { IWavesDraw } from "./waves.draw";
import { IAppStore } from "src/interfaces/store";
require("./styles.scss");

interface ISignProps {
  store?: {
    appStore: IAppStore;
  };
}

@inject("store")
@observer
export default class Sign extends React.Component<ISignProps> {
  private canvas: React.RefObject<HTMLCanvasElement>;
  private waves: IWavesDraw;
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
  }

  public componentDidMount() {
    this.waves = new WavesDraw(this.canvas.current);
  }

  public render() {
    return(
      <div className="sign">
        <div className="sign__canvas-wrapper">
          <canvas ref={this.canvas}/>
        </div>
        <img src="/assets/logo.png" alt="logo" className="sign__logo"/>
        <div className="sign__form">
          <div>
            <input type="text" className="sign__form-input" placeholder="Login"/>
            <input type="text" className="sign__form-input" placeholder="Pass"/>
          </div>
          <div>
            <div>Hi</div>
            <button>Sign In</button>
          </div>
        </div>
      </div>
    );
  }
}
