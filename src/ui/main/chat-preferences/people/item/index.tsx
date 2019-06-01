import * as React from "react";

import { IChatUser } from "src/models/chat";
import PeopleItemMenu from "./menu";
require("./styles.scss");

interface IPeopleItemProps {
 user: IChatUser;
 choosen: number;
 chose: (id: number) => void;
}

export default function PeopleItem(props: IPeopleItemProps) {
  const choosen = (props.choosen === props.user.ID);

  return  <div className={choosen ? "people-item-active" : "people-item"}>
  <div onClick={() => props.chose(props.user.ID)} className="people-item__info">
    <div>
      {props.user.Name.substring(0, 2).toUpperCase()}
    </div>
    <div>
      {props.user.Name}
    </div>
  </div>
  {(choosen ? <PeopleItemMenu user={props.user}/> : <div/>)}
</div>;
}

// export default class PeopleItem extends React.Component<IPeopleItemProps> {
//   constructor(props) {
//     super(props);
//   }
//   public render() {
//     return(

//     );
//   }
// }
