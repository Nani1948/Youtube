import express from "express";

import {
    getVideos,
    getVideoById,
    createVideo,
    updateVideo,
    deleteVideo,
    likeVideo,
    dislikeVideo,
    removeLike,
    removeDislike
} from "../controllers/videoController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all videos
router.get("/", getVideos);

// Get video by ID
router.get("/:id", getVideoById);

// Create a new video
router.post("/", authMiddleware, createVideo);

// Update video
router.put("/:id", authMiddleware, updateVideo);

// Delete video
router.delete("/:id", authMiddleware, deleteVideo);

// Like video
router.post("/:id/like", authMiddleware, likeVideo);

//Remove like
router.post("/:id/remove-like", authMiddleware, removeLike);
// Dislike video
router.post("/:id/dislike", authMiddleware, dislikeVideo);
//Remove dislike

router.post("/:id/remove-dislike", authMiddleware, removeDislike);
export default router;