import { Response, NextFunction } from "express";
import courseModel from "../models/course.model";
import { CatchAsyncError } from "../middleware/catch_async_error";
import ErrorHandler from "../utils/error_handler";

/// create course
export const createCourse = CatchAsyncError(
  async (data: any, res: Response) => {
    const course = await courseModel.create(data);
    res.status(201).json({
      success: true,
      course,
    });
  }
);
