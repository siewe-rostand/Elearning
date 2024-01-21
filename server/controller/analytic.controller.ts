import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/error_handler";

import { CatchAsyncError } from "../middleware/catch_async_error";
import { generateLast12MonthsData } from "../utils/analytic.generator";
import userModel from "../models/user-model";

// get user analytics --only for admin

export const getUserAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await generateLast12MonthsData(userModel);

      res.status(200).json({
        success: true,
        message: "Statitics of created users in last 12 months",
        users,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
