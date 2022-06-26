import mongoose from "mongoose";

export interface IUser {
  name: string;
  email: string;
  token?: string[];
  refresh_token?: string[];
  hash?: string;
  salt?: string;
  setPassword?: (password: string) => void;
  validPassword?: (password: string) => string;
}

export interface IUserDoc {
  name: string;
  email: string;
}
export interface IUserModelInterface extends mongoose.Model<IUserDoc> {
  build(attr: IUser): IUserDoc;
}
