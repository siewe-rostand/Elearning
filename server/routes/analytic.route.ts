import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { getUserAnalytics } from "../controller/analytic.controller";

const analyticRouter = express.Router();

analyticRouter.get(
  "/stats/users",
  isAuthenticated,
  authorizeRoles("admin"),
  getUserAnalytics
);

export default analyticRouter;
