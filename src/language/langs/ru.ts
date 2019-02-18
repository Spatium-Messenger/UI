import { ILanguage } from "../interface";

const ru: ILanguage = {
  sign: {
    anon: "Войти анонимно",
    enter: "Войти",
    in: "Вход",
    start: "Вперед!",
    up: "Регистрация",
    input: {
      login: "Логин",
      pass: "Пароль",
    },
  },
  chats: {
    search: "Поиск...",
  },
  menu: {
    back: "Вернуться в Swap",
    cache: "Кэш",
    logout: "Выйти",
    newChat: "Новый чат",
    profile: "Профиль",
    settings: "Настройки",
    signed: "В СЕТИ КАК",
  },
  messages: {
    choose: "Выберите чат слева или создайте новый в меню",
    input: {
      placeholder: "Сообщение...",
    },
  },
};

export default ru;
