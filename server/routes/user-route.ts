import express from "express";
import {
  registrationUser,
  activateUser,
  loginUser,
  logoutUser,
  updateAccessToken,
  getUserDetails,
  updateUserInfo,
} from "../controller/user-controller";
import { isAuthenticated } from "../middleware/auth";
import { socialAuth, updatePassword } from "../service/user.service";

const userRouter = express.Router();

userRouter.post("/registration", registrationUser);

userRouter.post("/activate-user", activateUser);

userRouter.post("/login", loginUser);

userRouter.post("/logout", isAuthenticated, logoutUser);

userRouter.get("/refresh_token", updateAccessToken);

userRouter.get("/user", isAuthenticated, getUserDetails);

userRouter.post("/social-auth", socialAuth);

userRouter.put("/user/edit", isAuthenticated, updateUserInfo);

userRouter.put("/user/edit/password", isAuthenticated, updatePassword);

export default userRouter;
