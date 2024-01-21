import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/error_handler";

import { CatchAsyncError } from "../middleware/catch_async_error";
import { generateLast12MonthsData } from "../utils/analytic.generator";
import userModel from "../models/user-model";
import courseModel from "../models/course.model";
import orderModel from "../models/order.model";

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

// get courses analytics --only for admin

export const getCoursesAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courses = await generateLast12MonthsData(courseModel);

      res.status(200).json({
        success: true,
        message: "Statitics of created courses in last 12 months",
        courses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get order analytics --only for admin

export const getOrdersAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await generateLast12MonthsData(orderModel);

      res.status(200).json({
        success: true,
        message: "Statitics of created orders in last 12 months",
        orders,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
