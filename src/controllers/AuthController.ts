import User from "@models/User";
import { IUser } from "@interfaces/IUser";
import { Request, Response, NextFunction } from "express";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "@helpers/jwt.helper";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    const user = (await User.findOne({ email: email })) as any;
    if (!user) {
      res.status(400).send({
        message: "User not found.",
      });
    }
    if (user.validPassword && user.validPassword(req.body.password)) {
      const token = await signAccessToken(user._id.toString(), user.email);
      const refresh_token = await signRefreshToken(user._id.toString());
      // save user token
      user.token.push(token);
      user.refresh_token.push(refresh_token);
      user.save();
      // user
      return res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json({
          token,
          refresh_token,
        });
    }
    return res.status(400).send({
      message: "Wrong Password",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Server error.",
    });
  }
  // Our register logic ends here
};

export const getMe = (req: Request, res: Response, next: NextFunction) => {
  let user = req.body.user;
  return res.status(200).json(user);
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  return res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "Successfully logged out 😏 🍀" });
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = (await verifyRefreshToken(req.body.refresh_token)) as any;
    const token = await signAccessToken(data._id.toString(), data.email);
    const refresh_token = await signRefreshToken(data._id.toString());
    User.update(
      { id: data._id },

      {
        $pull: {
          token: req.cookies.access_token,
          refresh_token: req.body.refresh_token,
        },
        $push: {
          token,
          refresh_token,
        },
      }
    );
     return res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json({
          token,
          refresh_token,
        });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
