import express from "express";
import {
    registerUser,
    loginUser
} from "../controllers/authController.js";

// Create Express Router
const router = express.Router();

// Route for registering a new user
router.post("/register", registerUser);

// Route for logging in an existing user
router.post("/login", loginUser);

// Export router
export default router;