import * as React from "react";
require("./styles.scss");

interface IInputFieldProps {
  onChange?: (value: string) => void;
  placeholder?: string;
  startValue?: string;
  type?: string;
  className?: string;
  tabindex?: number;
}

interface IInputFieldState {
  value: string;
}

export default class InputField extends React.Component<IInputFieldProps, IInputFieldState> {
  constructor(props) {
    super(props);
    this.state = {
      value: (this.props.startValue ? this.props.startValue : "") ,
    };
    this.change = this.change.bind(this);
  }

  public change(e: React.FormEvent<HTMLInputElement>) {
    if (this.props.onChange) {
      this.props.onChange(e.target["value"]);
      this.setState({value: e.target["value"]});
    }
  }

  public render() {
    const cname = (this.props.className ? this.props.className : "");
    const placeholder = (this.props.placeholder ? this.props.placeholder : "");
    return(
      <input
        tabIndex={this.props.tabindex || -1}
        className={"default-input " + cname}
        placeholder={placeholder}
        onChange={this.change}
        value={this.state.value}
      />
    );
  }
}
