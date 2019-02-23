export interface ILanguage {
  name: string;
  id: string;
  icon: string;
  sign: ILanguageSign;
  chats: ILanguageChats;
  messages: ILanguageMessagesWindow;
  menu: ILanguageMenu;
  chatPreferences: ILanguageChatPreferences;
  popups: ILanguagePopups;
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
  notFound: string;
}

interface ILanguageMessagesWindow {
  choose: string;
  input: {
    placeholder: string;
  };
  months: string[];
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

interface ILanguageChatPreferences {
  up: {
    header: string;
    placeholder: string;
  };
  people: {
    header: string;
    add: string;
  };
}

interface ILanguagePopups {
  createChat: ILanguagePopupsCreateChat;
  addUsers: ILanguagePopupsAddUsers;
  cache: ILanguagePopupsCache;
  lang: ILanguagePopupsLang;
}

interface ILanguagePopupsCreateChat {
  header: string;
  paragraph: string;
  placeholder: string;
  button: string;
}

interface ILanguagePopupsAddUsers {
  header: string;
  placeholder: string;
  notfound: string;
}

interface ILanguagePopupsCache {
  header: string;
  size: string;
  clearButton: string;
}

interface ILanguagePopupsLang {
  header: string;
}
