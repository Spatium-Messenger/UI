import { ILanguage } from "../interface";

const en: ILanguage = {
  sign: {
    anon: "Enter as anonymous",
    enter: "Enter",
    in: "Sign In",
    start: "Start",
    up: "Sign Up",
    input: {
      login: "Login",
      pass: "Password",
    },
  },
  chats: {
    search: "Search...",
  },
  menu: {
    back: "Back to Swap",
    cache: "Cache",
    logout: "Log Out",
    newChat: "New Chat",
    profile: "Profile",
    settings: "Settings",
    signed: "SIGNED IN AS",
  },
  messages: {
    choose: "Choose chat left or create new in menu",
    input: {
      placeholder: "Message...",
    },
  },
  chatPreferences: {
    up: {
      header: "Chat details",
      placeholder: "Name",
    },
    people: {
      header: "People",
      add: "Invite People",
    },
  },
  popups: {
    createChat: {
      header: "Create new chat",
      paragraph: "Input name of chat",
      placeholder: "Name",
      button: "Create",
    },
    addUsers: {
      header: "Add Users",
      placeholder: "Name",
      notfound: "Not found",
    },
  },
};

export default en;
