import { ILocalStorage } from "src/interfaces/local-storage";

export default class LocalStorage implements ILocalStorage {
  private storage: Storage;
  constructor() {
    this.storage = window.localStorage;
  }

  public Get(key: string): string {
    return this.storage.getItem(key);
  }

  public Set(key: string, value: string) {
    this.storage.setItem(key, value);
  }

  public Remove(key: string) {
    this.storage.removeItem(key);
  }

  public Clear() {
    this.storage.clear();
  }

  public Size(): string {
    let strings: string = "";
    for (const key in this.storage) {
      if (this.storage.hasOwnProperty(key)) {
        strings += this.storage[key];
      }
    }
    return strings ? 3 + Math.round(((strings.length * 16) / (8 * 1024))) + " KB" : "0 KB";
  }
}
