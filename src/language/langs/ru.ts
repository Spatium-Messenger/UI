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
  chatPreferences: {
    up: {
      header: "Настройки чата",
      placeholder: "Имя",
    },
    people: {
      header: "Участники",
      add: "Пригласить",
    },
  },
  popups: {
    createChat: {
      header: "Создать новый чат",
      paragraph: "Введите имя чата",
      placeholder: "Имя",
      button: "Создать",
    },
    addUsers: {
      header: "Пригласить участника",
      placeholder: "Имя",
      notfound: "Не найдено",
    },
    cache: {
      header: "Кэш",
      clearButton: "Очистить",
      size: "Занято",
    },
  },
};

export default ru;
