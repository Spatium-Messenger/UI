import * as React from "react";
import { IChatUser } from "src/models/chat";
import { IRootStore } from "src/store/interfeces";
import { observer, inject } from "mobx-react";

require("./styles.scss");

interface IPeopleItemMenuProps {
  user: IChatUser;
  store?: IRootStore;
}

export default inject("store")(observer((props: IPeopleItemMenuProps) => {
  return <div className="people-item__menu">
    <div className="people-item__menu__item">Menu</div>
  </div>;
}));
