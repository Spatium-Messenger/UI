import * as React from "react";
import { observer, inject } from "mobx-react";
import { IRootStore } from "src/store/interfeces";

export default inject("store")(observer((props: {store?: IRootStore}) => {
  const users = props.store.chatStore.usersForDialog.map((v, i) =>
   <div key={i}>
    {v.Name}
  </div>);
  return <div>{users}</div>;
}));
