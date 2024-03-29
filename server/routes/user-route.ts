import express from "express";
import {
  registrationUser,
  activateUser,
  loginUser,
  logoutUser,
  updateAccessToken,
  getUserDetails,
  updateUserInfo,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "../controller/user-controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  socialAuth,
  updatePassword,
  updateProfilePicture,
} from "../service/user.service";

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

userRouter.put("/user/edit/picture", isAuthenticated, updateProfilePicture);

userRouter.get("/users", isAuthenticated, authorizeRoles("admin"), getAllUsers);

userRouter.put(
  "/users/edit",
  isAuthenticated,
  authorizeRoles("admin"),
  updateUserRole
);

userRouter.delete(
  "/users/:id/delete",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteUser
);

export default userRouter;
