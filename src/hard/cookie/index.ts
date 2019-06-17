import { ICookie } from "src/interfaces/cookie";
import Config from "src/config";

export default class Cookie implements ICookie {
  // private cookie: string;
  constructor() {
    // this.cookie = docCookie;
  }

  public Get(key: string) {
    const matches = document.cookie.match(new RegExp(
      "(?:^|; )" + key.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)",
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  public Set(key: string, value: string) {
    const expires = Config.cookieExpire;

    const d = new Date();
    d.setTime(d.getTime() + expires * 1000);

    value = encodeURIComponent(value);

    let updatedCookie = key + "=" + value;

    updatedCookie += "; expires";
    updatedCookie += "=" + d.toUTCString();
    document.cookie = updatedCookie;
  }

}
