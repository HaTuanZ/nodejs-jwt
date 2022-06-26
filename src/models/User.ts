import mongoose from "mongoose";
import * as crypto from "crypto";
import { IUser, IUserDoc, IUserModelInterface } from "@interfaces/IUser";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      dropDups: true,
    },
    token: [String],
    refresh_token: [String],
    hash: String,
    salt: String,
  },
  {
    timestamps: true,
  }
);

// Method to set salt and hash the password for a user
userSchema.methods.setPassword = function (password: string) {
  // Creating a unique salt for a particular user
  this.salt = crypto.randomBytes(16).toString("hex");

  // Hashing user's salt and password with 1000 iterations,

  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
    .toString(`hex`);
};

// Method to check the entered password is correct or not
userSchema.methods.validPassword = function (password: string) {
  var hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
    .toString(`hex`);
  return this.hash === hash;
};

userSchema.statics.build = function (attr: IUser) {
  let user = new User(attr);
  if (attr.hash && user.setPassword) {
    user.setPassword(attr.hash);
  }
  user.save();
  return user;
};
const User = mongoose.model<IUserDoc, IUserModelInterface>("User", userSchema);
export default User;
