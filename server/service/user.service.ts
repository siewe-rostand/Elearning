import { NextFunction, Response, Request } from "express";
import userModel from "../models/user-model";
import { CatchAsyncError } from "../middleware/catch_async_error";
import ErrorHandler from "../utils/error_handler";
import { sendToken } from "../utils/jwt";

// get user by id
export const getUserById = async (id: string, res: Response) => {
  const user = await userModel.findById(id);

  res.status(200).json({
    success: true,
    user,
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
