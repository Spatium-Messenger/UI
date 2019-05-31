import * as React from "react";
import { observer, inject } from "mobx-react";
import { IChatUser } from "src/models/chat";
require("./styles.scss");

interface IPeopleItemProps {
 user: IChatUser;
 choosen: number;
 chose: (id: number) => void;
}

export default function PeopleItem(props: IPeopleItemProps) {
  const choosen = (props.choosen === props.user.ID);
  const menu = <div>
    Menu
  </div>;

  return  <div className={choosen ? "people-item-active" : "people-item"}>
  <div onClick={() => props.chose(props.user.ID)} className="people-item__info">
    <div>
      {props.user.Name.substring(0, 2).toUpperCase()}
    </div>
    <div>
      {props.user.Name}
    </div>
  </div>
  {(choosen ? menu : <div/>)}
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
