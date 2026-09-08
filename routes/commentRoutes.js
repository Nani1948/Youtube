import express from "express";

import {
    getComments,
    getCommentById,
    createComment,
    updateComment,
    deleteComment
} from "../controllers/commentController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all comments
router.get("/", getComments);

// Get comment by ID
router.get("/:id", getCommentById);

// Create a comment
router.post("/", authMiddleware, createComment);

// Update a comment
router.put("/:id", authMiddleware, updateComment);

// Delete a comment
router.delete("/:id", authMiddleware, deleteComment);

export default router;