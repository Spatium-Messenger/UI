export interface IAPIUser {
  Enter: (login: string, pass: string) => Promise<{result: string}>;
  ProveToken: () => Promise<void>;
  CreateUser: (login: string, pass: string) => Promise<{result: string}>;
  GetMyData: () => Promise<{result: string}>;
  GetSettings: () => Promise<void>;
  SetSettings: (name: string, language: string) => Promise<{result: string}>;
}
