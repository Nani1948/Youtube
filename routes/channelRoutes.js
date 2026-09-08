import express from "express";
import {
    createChannel,
    getChannels,
    getChannelById,
    updateChannel,
    deleteChannel
} from "../controllers/channelController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all channels
router.get("/", getChannels);

// Get channel by ID
router.get("/:id", getChannelById);

// Create a new channel
router.post("/", authMiddleware, createChannel);

// Update channel
router.put("/:id", authMiddleware, updateChannel);

// Delete channel
router.delete("/:id", authMiddleware, deleteChannel);

export default router;
