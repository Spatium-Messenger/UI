import {IConfig} from "src/interfaces/config";

const config: IConfig = {
  language: "en",
  cookieExpire: 2592000, // 30 days
  files: {
    maxSize: 104857600, // 10 MB
  },
};

export default config;
