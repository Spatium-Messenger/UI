import { ILanguage } from "../interface";
const icon: string = require("assets/langs/ru.svg");
const ru: ILanguage = {
  name: "Русский",
  id: "ru",
  icon,
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
    notFound: "Не найдено",
  },
  menu: {
    back: "Вернуться в Swap",
    cache: "Кэш",
    logout: "Выйти",
    newChat: "Новый чат",
    newChannel: "Новый канал",
    profile: "Профиль",
    settings: "Настройки",
    signed: "В СЕТИ КАК",
  },
  messages: {
    choose: "Выберите чат слева или создайте новый в меню",
    input: {
      placeholder: "Сообщение...",
    },
    months: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
    header: {
      online: "Онлайн",
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
    createChannel: {
      header: "Создать новый канал",
      paragraph: "Введите имя канала",
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
    lang: {
      header: "Язык",
    },
  },
};

export default ru;
