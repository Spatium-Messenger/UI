export interface ILocalStorage {
  Get: (key: string) => string;
  Set: (key: string, value: string) => void;
  Remove: (key: string) => void;
  Clear: () => void;
  Size: () => string;
}
