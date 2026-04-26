import express from "express";
import { loginUser, registerUser, listUsers, deleteUser, updateUser, getAdminStats } from "../controllers/userController.js";
import adminAuth from "../middleware/adminAuth.js";

const userRouter = express.Router();

userRouter.post("/register",registerUser);
userRouter.post("/login",loginUser);

// Admin routes
userRouter.get("/list", adminAuth, listUsers);
userRouter.post("/remove", adminAuth, deleteUser);
userRouter.post("/update", adminAuth, updateUser);
userRouter.get("/stats", adminAuth, getAdminStats);

export default userRouter;
