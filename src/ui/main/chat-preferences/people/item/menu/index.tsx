import * as React from "react";
import { IChatUser } from "src/models/chat";
import { IRootStore } from "src/store/interfeces";
import { observer, inject } from "mobx-react";
import { ILanguage } from "src/language/interface";

require("./styles.scss");

const ban = require("assets/ban.svg");
const unban = require("assets/unban.svg");

interface IPeopleItemMenuProps {
  user: IChatUser;
  lang: ILanguage;
  store?: IRootStore;
}

export default inject("store")(observer((props: IPeopleItemMenuProps) => {
  const banAction = () => props.store.chatStore.blockUser(props.user.ID);

  const unbanAction = () => props.store.chatStore.unblockUser(props.user.ID);

  const lang = props.lang.chatPreferences;
  const blocked = (props.user.Blocked ?
    <div className="people-item__menu__item-green" onClick={unbanAction}>
      <div dangerouslySetInnerHTML={{__html: unban}}/>
      <span>{lang.people.unban}</span>
    </div> :
    <div className="people-item__menu__item-red" onClick={banAction}>
      <div dangerouslySetInnerHTML={{__html: ban}}/>
      <span>{lang.people.ban}</span>
    </div>
    );

  return <div className="people-item__menu">
    {blocked}
  </div>;
}));
