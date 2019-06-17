import EN from "./langs/en";
import RU from "./langs/ru";
import { ILanguage } from "./interface";

const languages: Map<string, ILanguage> = new Map<string, ILanguage>();
languages.set(RU.id, RU);
languages.set(EN.id, EN);

export default languages;
