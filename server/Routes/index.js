import express from "express";
const router = express.Router();
import authRoutes from "./Auth.js";
import { verifyToken } from "../Middleware/AuthMiddleWare.js";
import coreRoutes from "./Core.js";
import employeeRoutes from "./Employee.js";
router.use("/auth", authRoutes);
router.use("/core", verifyToken, coreRoutes);
router.use("/employee", verifyToken, employeeRoutes);

export default router;