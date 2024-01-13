import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  addAnswer,
  addQuestion,
  getAllCourses,
  getCourseByUser,
  getSingleCourse,
  updateCourse,
  uploadCourse,
} from "../controller/course.controller";

const courseRouter = express.Router();

courseRouter.post(
  "/course/create",
  isAuthenticated,
  authorizeRoles("admin"),
  uploadCourse
);

courseRouter.put(
  "/course/edit/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  updateCourse
);

courseRouter.get("/course/get/:id", getSingleCourse);

courseRouter.get("/courses", getAllCourses);

courseRouter.get("/user/course/:id", isAuthenticated, getCourseByUser);

courseRouter.post("/course/question/add", isAuthenticated, addQuestion);

courseRouter.post("/course/question/reply", isAuthenticated, addAnswer);

export default courseRouter;
