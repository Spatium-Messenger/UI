import * as React from "react";
import { IChat } from "src/models/chat";
import SideBarItem from "./item";
import { ILanguage } from "src/language/interface";

require("./styles.scss");

export default function Chats(
  props: {chats: IChat[], currentChat: number, search: string, lang: ILanguage, chooseChat: (chat: IChat) => void},
) {
  const chats: JSX.Element[] = [];
  props.chats.map(
    (value, i) => {
      const currentID = props.currentChat;
      if  (value.Name.toLowerCase().indexOf(props.search.toLowerCase()) !== -1) {
        chats.push(
          <SideBarItem
           chat={value}
           key={i}
           chooseChat={props.chooseChat}
           active={(value.ID === currentID)}
          />,
        );
      }
    },
  );

  return <div>
    {chats}
    <div className="sidebar__items__notfound">
      {(chats.length === 0 ? props.lang.chats.notFound : "")}
    </div>
  </div>;
}
