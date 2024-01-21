import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  getCoursesAnalytics,
  getOrdersAnalytics,
  getUserAnalytics,
} from "../controller/analytic.controller";

const analyticRouter = express.Router();

analyticRouter.get(
  "/stats/users",
  isAuthenticated,
  authorizeRoles("admin"),
  getUserAnalytics
);

analyticRouter.get(
  "/stats/courses",
  isAuthenticated,
  authorizeRoles("admin"),
  getCoursesAnalytics
);

analyticRouter.get(
  "/stats/orders",
  isAuthenticated,
  authorizeRoles("admin"),
  getOrdersAnalytics
);

export default analyticRouter;
