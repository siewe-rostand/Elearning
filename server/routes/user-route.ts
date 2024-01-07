import express from "express";
import {
  registrationUser,
  activateUser,
  loginUser,
  logoutUser,
} from "../controller/user-controller";

const userRouter = express.Router();

userRouter.post("/registration", registrationUser);

userRouter.post("/activate-user", activateUser);

userRouter.post("/login", loginUser);

userRouter.post("/logout", logoutUser);

export default userRouter;
