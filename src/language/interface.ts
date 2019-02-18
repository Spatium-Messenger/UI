export interface ILanguage {
  sign: ILanguageSign;
  chats: ILanguageChats;
  messages: ILanguageMessagesWindow;
  menu: ILanguageMenu;
}

interface ILanguageSign {
  in: string;
  up: string;
  enter: string;
  start: string;
  anon: string;
  input: {
    login: string;
    pass: string;
  };
}

interface ILanguageChats {
  search: string;
}

interface ILanguageMessagesWindow {
  choose: string;
  input: {
    placeholder: string;
  };
}

interface ILanguageMenu {
  signed: string;
  back: string;
  newChat: string;
  profile: string;
  cache: string;
  settings: string;
  logout: string;
}
