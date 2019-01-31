import * as React from "react";
import { observer, inject } from "mobx-react";
import { IInputData, IInputStore } from "src/interfaces/store";
import { IAudioMessage } from "src/models/audio";
require("./styles.scss");

const playIcon = require("assets/play.svg");

interface IPlayVoiceMessageProps {
  data: IAudioMessage;
}

interface IPlayVoiceMessageState {
  listen: boolean;
  current: number;
  duration: number;
}

export default class PlayVoiceMessage extends React.Component<IPlayVoiceMessageProps, IPlayVoiceMessageState> {
  private audio: HTMLAudioElement;
  private intervals: NodeJS.Timeout;
  private timelineRef: React.RefObject<HTMLDivElement>;
  constructor(props) {
    super(props);
    const audioUrl = URL.createObjectURL(this.props.data.src.blob);
    this.audio = new Audio(audioUrl);
    this.state = {
      listen: false,
      duration: this.props.data.src.duration,
      current: 0,
    };
    this.changeListen = this.changeListen.bind(this);
    this.timer = this.timer.bind(this);
    this.rewind = this.rewind.bind(this);
    this.intervals = setInterval(this.timer, 200);
    this.timelineRef = React.createRef();
  }

  public changeListen() {
    if (this.state.listen) {
      // console.log("Stop");
      this.audio.pause();
      this.setState({listen: false});
    } else {
      // console.log("Play");
      this.audio.play();
      this.setState({listen: true});
    }
  }

  public rewind(e: React.MouseEvent) {
    //
    const x = e.clientX - this.timelineRef.current.offsetLeft;
    const pos =  x / this.timelineRef.current.offsetWidth;
    this.audio.currentTime = pos * this.audio.duration;
    console.log(pos, pos * this.audio.duration);
    this.setState({
      current: this.audio.currentTime,
    });

    // console.log(e.clientX);
  }

  public render() {
    const button: JSX.Element = (!this.state.listen ?
       <div className="voice-record-play__play" dangerouslySetInnerHTML={{__html: playIcon}}/> :
      <div className="voice-record-play__stop" />);
    return(
      <div className="voice-record-active" >
        <div className="voice-record-play__button" onClick={this.changeListen}>
          {button}
        </div>
        <div  className="voice-record__play-timeline" onClick={this.rewind} ref={this.timelineRef}>
          <div
            className="voice-record__play-timeline__inner"
            style={{width: (this.state.current / this.state.duration * 100) + "%"}}
          />
        </div>
        <div className="voice-recoed-play__duration">
          {this.formatTime(this.state.current) + "/" + this.formatTime(this.state.duration)}
        </div>
      </div>
    );
  }

  private formatTime(duration: number): string {
    const minutes = Math.round(duration / 60);
    const seconds = Math.round(duration);
    return minutes + ":" + (seconds > 9 ? seconds : "0" + seconds);
  }

  private timer() {
    if (this.state.listen) {
      const data: {listen: boolean, current: number} = {
        current: this.audio.currentTime,
        listen: this.state.listen,
      };
      console.log(this.audio.currentTime, this.state.duration);
      if (data.current.toFixed(1) === this.state.duration.toFixed(1)) {
        // data.current = this.state.duration;
        data.listen = false;
        this.audio.pause();
      }
      this.setState(data);
    }
  }
}
