import * as React from "react";
require("./styles.scss");

interface IButtonProps {
  onClick: () => void;
  text: string;
  active: boolean;
  loading: boolean;
  tabindex?: number;
}

export default class Button extends React.Component<IButtonProps> {
  constructor(props) {
    super(props);
  }
  public render() {
    return(
      <button
        className={this.props.active ? "default-button-active" : "default-button"}
        onClick={this.props.onClick}
        tabIndex={this.props.tabindex || -1}
      >
        {this.props.text}
      </button>
    );
  }
}
