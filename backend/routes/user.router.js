import express from "express";
import * as userController from "../controllers/userController.js";
import verifyToken from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.get("/allUsers", userController.getAllUsers);
userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
userRouter.get("/userProfile/:id", userController.getUserProfile);
userRouter.put("/updateProfile/:id", userController.updateUserProfile);
userRouter.delete("/deleteProfile/:id", userController.deleteUserProfile);

userRouter.get("/me", verifyToken, userController.getMyProfile);

export default userRouter;