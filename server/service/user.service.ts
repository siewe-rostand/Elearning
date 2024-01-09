import { NextFunction, Response, Request } from "express";
import userModel from "../models/user-model";
import { CatchAsyncError } from "../middleware/catch_async_error";
import ErrorHandler from "../utils/error_handler";
import { sendToken } from "../utils/jwt";
import { redis } from "../utils/redis";

// get user by id
export const getUserById = async (id: string, res: Response) => {
  const userJson = await redis.get(id);

  if (!userJson) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const user = JSON.parse(userJson);
  res.status(200).json({
    success: true,
    user: user,
  });
};

interface ISocialAuthBody {
  name: string;
  email: string;
  avatar: string;
}

export const socialAuth = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, avatar } = req.body as ISocialAuthBody;

      const user = await userModel.findOne({ email });

      if (!user) {
        const newUser = await userModel.create({ email, name, avatar });
        sendToken(newUser, 200, res);
      } else {
        sendToken(user, 200, res);
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 400));
    }
  }
);

// update password

interface IUpadtePasswordBody {
  oldPassword: string;
  newPassword: string;
}

export const updatePassword = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body as IUpadtePasswordBody;

      if (!oldPassword || !newPassword)
        return next(
          new ErrorHandler("Please provide old password and new password", 400)
        );

      const userId = req.user?._id;
      const user = await userModel.findById(userId).select("+password");

      if (user) {
        const isPasswordMatch = await user.comparePassword(oldPassword);
        if (!isPasswordMatch) {
          return next(new ErrorHandler("Password is incorrect", 400));
        }

        user.password = newPassword;
        await user.save();

        redis.set(userId, JSON.stringify(user));
        res.status(200).json({
          success: true,
          message: "Password updated successfully",
          user,
        });
      } else {
        return next(new ErrorHandler("User not found", 404));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 400));
    }
  }
);
