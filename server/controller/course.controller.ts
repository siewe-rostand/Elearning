import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catch_async_error";
import ErrorHandler from "../utils/error_handler";
import cloudinary from "cloudinary";
import { createCourse } from "../service/course.service";
import courseModel from "../models/course.model";
import { log } from "console";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import ejs, { name } from "ejs";
import { title } from "process";
import path from "path";
import sendMail from "../utils/send-mail";

// upload course
export const uploadCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;

      const thumbnail = data.thumbnail;
      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "course",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      createCourse(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// update course

export const updateCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const courseId = req.params.id;

      const thumbnail = data.thumbnail;

      if (!data || Object.keys(data).length === 0) {
        return next(new ErrorHandler("Please enter field to be updated", 400));
      }

      if (thumbnail) {
        await cloudinary.v2.uploader.destroy(data.thumbnail.public_id);
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "course",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      const course = await courseModel.findByIdAndUpdate(
        courseId,
        {
          $set: data,
        },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: "Course updated successfully",
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//get single course without purchasing

export const getSingleCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;

      const isCached = await redis.get(courseId);

      if (isCached) {
        res.status(200).json({
          success: true,
          message: "Course fetched successfully",
          course: JSON.parse(isCached),
        });
      } else {
        const course = await courseModel
          .findById(courseId)
          .select(
            "-courseData.videoUrl -courseData.videoDuration -courseData.link -courseData.suggestions -courseData.questions"
          );

        if (!course) {
          return next(new ErrorHandler("Course not found", 404));
        }

        await redis.set(courseId, JSON.stringify(course));
        res.status(200).json({
          success: true,
          message: "Course fetched successfully",
          course,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//get all courses without purchasing

export const getAllCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isCached = await redis.get("callCourses");
      if (isCached) {
        res.status(200).json({
          success: true,
          message: "Fetched all courses successfully",
          courses: JSON.parse(isCached),
        });
      } else {
        const courses = await courseModel.find().select("-courseData");

        if (!courses) {
          return next(new ErrorHandler("No courses found", 404));
        }

        await redis.set("allCourses", JSON.stringify(courses));

        res.status(200).json({
          success: true,
          message: "Fetched all courses successfully",
          courses,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get course content only for valid users

export const getCourseByUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;

      const courseExist = userCourseList?.find(
        (c: any) => c._id.toString() === courseId
      );

      if (!courseExist) {
        return next(
          new ErrorHandler(
            "You are not authorized to view this course content",
            401
          )
        );
      }

      const course = await courseModel.findById(courseId);

      const content = course?.courseData;

      res.status(200).json({
        success: true,
        message: "Course content fetched successfully",
        content,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// add question to course
interface IAddQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQuestion = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question, courseId, contentId }: IAddQuestionData = req.body;
      const course = await courseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("invalid content id", 404));
      }
      const courseContent = course.courseData.find((c: any) =>
        c._id.equals(contentId)
      );
      if (!courseContent) {
        return next(new ErrorHandler("invalid course content", 404));
      }

      //create a new question object
      const newQuestion: any = {
        user: req.user,
        question,
        questionReplies: [],
      };

      //add this new question to the course content
      courseContent.questions.push(newQuestion);

      //save the course
      await course?.save();

      res.status(200).json({
        success: true,
        message: "Question added successfully",
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// addanswer to course question
interface IAddAnswerData {
  answer: string;
  courseId: string;
  contentId: string;
  questionId: string;
}

export const addAnswer = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { answer, courseId, contentId, questionId }: IAddAnswerData =
        req.body;
      const course = await courseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("invalid content id", 404));
      }
      const courseContent = course.courseData.find((c: any) =>
        c._id.equals(contentId)
      );
      if (!courseContent) {
        return next(new ErrorHandler("invalid course content", 404));
      }

      if (!mongoose.Types.ObjectId.isValid(questionId)) {
        return next(new ErrorHandler("invalid question id", 404));
      }
      const question = courseContent.questions.find((q: any) =>
        q._id.equals(questionId)
      );
      if (!question) {
        return next(new ErrorHandler("invalid question", 404));
      }

      //create a new answer object
      const newAnswer: any = {
        user: req.user,
        answer,
      };

      //add this new answer to the question object
      question.questionReplies.push(newAnswer);

      //save the course
      await course?.save();

      //notify the user who asked the question
      if (req.user?._id === question.user._id) {
        // create a notification
      } else {
        const data = {
          name: question.user.name,
          title: courseContent.title,
        };

        const html = await ejs.renderFile(
          path.join(__dirname, "../mails/question-reply.ejs"),
          data
        );

        try {
          await sendMail({
            email: question.user.email,
            subject: "Question Reply",
            template: "question-reply.ejs",
            data,
          });
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 500));
        }
      }
      res.status(200).json({
        success: true,
        message: "Answer added successfully",
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
