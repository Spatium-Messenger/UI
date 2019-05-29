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
  error: string;
  signInErrors: {
    0: string;
    1: string;
    2: string;
  };
  signUpErrors: {
    0: string;
    1: string;
    2: string;
    3: string;
  };
  undefinedError: string;
}

interface ILanguageChats {
  search: string;
  notFound: string;
}

export interface ILanguageMessagesWindow {
  choose: string;
  input: {
    placeholder: string;
  };
  months: string[];
  header: {
    online: string;
  };
  messageCommands: {
    userCreatedChat: string;
    userCreatedChannel: string;
    userInvitedChat: string;
    userInvitedChannel: string;
  };
}

interface ILanguageMenu {
  signed: string;
  back: string;
  newChat: string;
  newChannel: string;
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
  createChannel: ILanguagePopupsNewChannel;
  addUsers: ILanguagePopupsAddUsers;
  cache: ILanguagePopupsCache;
  lang: ILanguagePopupsLang;
  userSettings: ILanguageUserSettings;
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

interface ILanguagePopupsNewChannel {
  header: string;
  paragraph: string;
  placeholder: string;
  button: string;
}

interface ILanguageUserSettings {
  header: string;
  name: string;
  saveButton: string;
}
