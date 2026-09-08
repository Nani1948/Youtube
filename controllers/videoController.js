import Video from "../models/Video.js";

// Create Video
export const createVideo = async (req, res) => {
    try {
        // Count existing videos
        const count = await Video.countDocuments();
        // Generate sequential video ID
        const videoId = `video${String(count + 1).padStart(3, "0")}`;
        //Get video data from request body
        const {
            title,
            thumbnailUrl,
            videoUrl,
            description,
            category,
            channelId,
            uploader,
            uploadDate
        } = req.body;

        //Create and save a new video in MongoDB
        const video = await Video.create({
            videoId,
            title,
            thumbnailUrl,
            videoUrl,
            description,
            category,
            channelId,
            uploader,
            uploadDate
        });

        //Send sucess response
        res.status(201).json({
            message: "Video created successfully",
            video
        });
    } catch (error) {
        //Send error response if video creation fails

        res.status(400).json({
            message: "Failed to create video",
            error: error.message
        });
    }
};

// Get All Videos
// Return video details + comments
export const getVideos = async (req, res) => {
    try {
        //Find all videos
        //Populate ("comments")get the complete comment details
        const videos = await Video.find().populate("comments");

        //Send videos as response
        res.status(200).json(videos);
    } catch (error) {
        //Send error response
        res.status(500).json({
            message: "Failed to fetch videos",
            error: error.message
        });
    }
};

// Get Video By ID
// Return video details + comments
export const getVideoById = async (req, res) => {
    try {
        //Find video using the custom videoId
        const video = await Video.findOne({
            videoId: req.params.id
        }).populate("comments");

        //check wether video exists
        if (!video) {
            return res.status(404).json({
                message: "Video not found"
            });
        }
        // Send video details with comments
        res.status(200).json(video);
    } catch (error) {
        // Send error response
        res.status(500).json({
            message: "Failed to fetch video",
            error: error.message
        });
    }
};

// Update Video
export const updateVideo = async (req, res) => {
    try {
        // Find video using videoId
        // Update it with the data from request body
        const video = await Video.findOneAndUpdate(
            { videoId: req.params.id },
            req.body,
            {
                // Return the updated document
                new: true,

                // Check schema validation
                runValidators: true
            }
        ).populate("comments");
        // Check whether video exists
        if (!video) {
            return res.status(404).json({
                message: "Video not found"
            });
        }
        // Send updated video

        res.status(200).json({
            message: "Video updated successfully",
            video
        });
    } catch (error) {

        // Send error response
        res.status(400).json({
            message: "Failed to update video",
            error: error.message
        });
    }
};
// Like video
export const likeVideo = async (req, res) => {
    try {
        const video = await Video.findOne({
            videoId: req.params.id
        });

        if (!video) {
            return res.status(404).json({
                message: "Video not found"
            });
        }
        // Increase likes by 1
        // If likes does not exist, start from 0
        video.likes = (video.likes || 0) + 1;
        //Save updated video to MongoDB
        await video.save();


        // Send success response
        res.status(200).json({
            message: "Video liked successfully",
            video
        });

    } catch (error) {

        // Send error response
        res.status(500).json({
            message: "Failed to like video",
            error: error.message
        });
    }
};
// Remove Like
export const removeLike = async (req, res) => {
    try {
        // Find video using videoId
        const video = await Video.findOne({
            videoId: req.params.id
        });

        // Check whether video exists
        if (!video) {
            return res.status(404).json({
                message: "Video not found"
            });
        }
        // Only decrease likes when the count is greater than 0
        if (video.likes > 0) {
            video.likes -= 1;
        }
        // Save updated video
        await video.save();
        // Send success response
        res.status(200).json({
            message: "Like removed successfully",
            video
        });

    } catch (error) {
        // Send error response
        res.status(500).json({
            message: "Failed to remove like",
            error: error.message
        });
    }
};

// Delete Video
export const deleteVideo = async (req, res) => {
    try {

        // Find and delete video using videoId
        const video = await Video.findOneAndDelete({
            videoId: req.params.id
        });

        // Check whether video exists
        if (!video) {
            return res.status(404).json({
                message: "Video not found"
            });
        }

        // Send success response
        res.status(200).json({
            message: "Video deleted successfully"
        });
    } catch (error) {
        // Send error response
        res.status(500).json({
            message: "Failed to delete video",
            error: error.message
        });
    }
};

// Dislike Video
export const dislikeVideo = async (req, res) => {
    try {
        // Find video using videoId
        const video = await Video.findOne({
            videoId: req.params.id
        });

        // Check whether video exists
        if (!video) {
            return res.status(404).json({
                message: "Video not found"
            });
        }

        // Increase dislikes by 1
        // If dislikes does not exist, start from 0
        video.dislikes = (video.dislikes || 0) + 1;

        // Save updated video
        await video.save();

        // Send success response
        res.status(200).json({
            message: "Video disliked successfully",
            video
        });

    } catch (error) {

        // Send error response
        res.status(500).json({
            message: "Failed to dislike video",
            error: error.message
        });
    }
};
// Remove Dislike
export const removeDislike = async (req, res) => {
    try {
        // Find video using videoId
        const video = await Video.findOne({
            videoId: req.params.id
        });

        // Check whether video exists
        if (!video) {
            return res.status(404).json({
                message: "Video not found"
            });
        }

        // Only decrease dislikes when count is greater than 0
        if (video.dislikes > 0) {
            video.dislikes -= 1;
        }

        // Save updated video
        await video.save();
        
        // Send success response
        res.status(200).json({
            message: "Dislike removed successfully",
            video
        });
        // Send error response
    } catch (error) {
        res.status(500).json({
            message: "Failed to remove dislike",
            error: error.message
        });
    }
};