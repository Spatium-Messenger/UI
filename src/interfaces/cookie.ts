export interface ICookie {
  Set: (key: string, value: string) => void;
  Get: (key: string) => string;
}
