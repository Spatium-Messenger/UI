import * as React from "react";
import { ILanguage } from "src/language/interface";
import languages from "src/language";

export default function LangsChoose(props: {currentLang: ILanguage, chooseLang: (id: string) => void}) {
  const langs: ILanguage[] = [];
  for (const l of languages.keys()) {
    if (languages.get(l).id !== props.currentLang.id) {
      langs.push(languages.get(l));
    }
  }

  const langsEl: JSX.Element[] = langs.map((l, i) =>
  <div
    onClick={() => props.chooseLang(l.id)}
    key={i}
    className="sign-lang-item"
  >
    <div dangerouslySetInnerHTML={{__html: l.icon}}/>
    <div>{l.name}</div>
  </div>);

  return <div className="sign__lang__content">
    {langsEl}
  </div>;
}
