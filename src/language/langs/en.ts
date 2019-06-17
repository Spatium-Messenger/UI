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
    error: "Error: ",
    signInErrors: {
      0: "Failed decode client's message, appeal to the admin.",
      1: "User with the login and the password doesn't exist.",
      2: "Failed generate token, appeal to the admin.",
    },
    signUpErrors: {
      0: "Failed decode client's message, appeal to the admin.",
      1: "Login or password is incorect, check it.",
      2: "Failed create new user, possibly user already exist.",
      3: "Failed generate token, appeal to the admin.",
    },
    undefinedError: "Undefined error. Error's code - ",
  },
  chats: {
    search: "Search...",
    notFound: "Not Found",
    usersHeader: "Users for dialog",
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
    choose: "Сhoose chat on the left or create a new one in the menu",
    banned: "You have been banned in the chat",
    input: {
      placeholder: "Message...",
    },
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sem", "Oct", "Nov", "Dec"],
    header: {
      online: "Online",
    },
    messageCommands: {
      null: "made something ...",
      userCreatedChat: "created chat",
      userCreatedChannel: "created channel",
      userInvitedChat: "was invited to the chat",
      userInvitedChannel: "was invited to the channel",
      userInsertedToDialog: "was invited to the dialog",
      userCreatedDialog: "created dialog",
      userLeaveChat: "left the chat",
      userReturnsToChat: "returned to the chat",
      userWasBanned: "was banned",
      userWasUnbanned: "was unbanned",
    },
  },
  chatPreferences: {
    up: {
      header: "Details",
      placeholder: "Name",
    },
    people: {
      header: "People",
      add: "Invite People",
      ban: "Ban user",
      unban: "Unban user",
    },
    deleteFromChat: "Get out of the conversationt",
    deleteFromList: "Delete chat from menu",
    turnBackToChat: "Return to chat",
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
    userSettings: {
      header: "User Settings",
      name: "Nickname",
      saveButton: "Save",
    },
  },
};

export default en;
