import * as React from "react";
import { observer, inject } from "mobx-react";
import { IRootStore } from "src/store/interfeces";
import { ILanguage } from "src/language/interface";

require("./styles.scss");
const user: string = require("assets/man-user.svg");

export default inject("store")(observer(
  (props: {store?: IRootStore, lang: ILanguage, choose: (id: number) => void}) => {
  const users = props.store.chatStore.usersForDialog.map((v, i) =>
  <div className="sidebar-user" key={i} onClick={() => props.choose(v.ID)}>
    <div
      className="sidebar-user__icon"
      dangerouslySetInnerHTML={{__html: user}}
    />
    <div className="sidebar-user__info">
      <div className="sidebar-user__info__name">{v.Name}</div>
      <div className="sidebar-user__info__login">{v.Login}</div>
    </div>
  </div>,
  );

  const header = (users.length > 0 ?
    <div className="sidebar-users__header">
      {props.lang.chats.usersHeader}
    </div> :
    <div/>
    );
  return <div>
    {header}
    {users}
  </div>;
}));
