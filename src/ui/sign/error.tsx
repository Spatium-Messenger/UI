import * as React from "react";
import { ILanguage } from "src/language/interface";

export default function SignError(props: {signInOrUp: boolean, lang: ILanguage, errorCode: number}) {
  if (props.errorCode === -1) {
    return <div/>;
  }

  const signLang = props.lang.sign;
  const errors = (props.signInOrUp ? signLang.signInErrors : signLang.signUpErrors);
  let text = props.lang.sign.error;
  if (!errors.hasOwnProperty(props.errorCode)) {
    text += signLang.undefinedError + props.errorCode;
  } else {
    text += errors[props.errorCode];
  }

  return  <div className="sign__error">{text}</div>;
}
