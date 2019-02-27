import { ILanguage } from "../interface";
const icon: string = require("assets/langs/en.svg");
const en: ILanguage = {
  name: "English",
  id: "en",
  icon,
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
    notFound: "Not Found",
  },
  menu: {
    back: "Back to Swap",
    cache: "Cache",
    logout: "Log Out",
    newChat: "New Chat",
    newChannel: "New Channel",
    profile: "Profile",
    settings: "Settings",
    signed: "SIGNED IN AS",
  },
  messages: {
    choose: "Choose chat left or create new in menu",
    input: {
      placeholder: "Message...",
    },
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sem", "Oct", "Nov", "Dec"],
    header: {
      online: "Online",
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
    createChannel: {
      header: "Create new channel",
      paragraph: "Input name of channel",
      placeholder: "Name",
      button: "Create",
    },
    addUsers: {
      header: "Add Users",
      placeholder: "Name",
      notfound: "Not found",
    },
    cache: {
      header: "Cache",
      clearButton: "Clear",
      size: "Size",
    },
    lang: {
      header: "Language",
    },
  },
};

export default en;
