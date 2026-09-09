import Video from "../models/Video.js";
import Channel from "../models/Channel.js";
// Create Video
export const createVideo = async (req, res) => {
    try {
        // Find the video with the highest existing videoId.
        const lastVideo = await Video.findOne()
            .sort({ videoId: -1 });

        // Start video numbering from 1.
        let nextNumber = 1;

        // Check whether any video already exists.
        if (lastVideo) {

            // Extract the number from the existing videoId.
            const lastNumber = parseInt(
                lastVideo.videoId.replace("video", ""),
                10
            );

            // Generate the next number.
            nextNumber = lastNumber + 1;
        }

        // Generate the next video ID.
        const videoId = `video${String(nextNumber).padStart(3, "0")}`;
        //Get video data from request body
        const {
            title,
            thumbnailUrl,
            videoUrl,
            description,
            category,
            channelId,
            uploadDate
        } = req.body;

        // Get the logged-in user's ID from JWT.
        const uploader = req.user.userId;
        // Check whether the channel belongs to the logged-in user.
        const channel = await Channel.findOne({
            channelId,
            owner: req.user.userId
        });

        // Prevent uploading to another user's channel.
        if (!channel) {
            return res.status(403).json({
                message: "You can only upload videos to your own channel"
            });
        }

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
         // Add channel name to every video.
        const videosWithChannelName = await Promise.all(
         videos.map(async (video) => {

                // Find the channel using channelId.
                const channel = await Channel.findOne({
                    channelId: video.channelId
                });

                // Return video with channel name.
                return {
                    ...video.toObject(),

                    // Add channel name.
                    channelName: channel
                        ? channel.channelName
                        : video.channelId
                };
            })
        );

        //Send videos as response
        res.status(200).json(videosWithChannelName);
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
        const video = await Video.findOne({
            videoId: req.params.id
        });

        // Check whether video exists
        if (!video) {
            return res.status(404).json({
                message: "Video not found"
            });
        }
        // Check whether the logged-in user owns this video.
        if (String(video.uploader) !== String(req.user.userId)) {
            return res.status(403).json({
                message: "You can update only your own video"
            });
        }
        // Update only the fields that the owner is allowed to change.
        const {
            title,
            thumbnailUrl,
            videoUrl,
            description,
            category,
            channelId,
            uploadDate
        } = req.body;

        if (title !== undefined) video.title = title;
        if (thumbnailUrl !== undefined) video.thumbnailUrl = thumbnailUrl;
        if (videoUrl !== undefined) video.videoUrl = videoUrl;
        if (description !== undefined) video.description = description;
        if (category !== undefined) video.category = category;
        // Check channel ownership before changing channel.
          if (channelId !== undefined) {
            const channel = await Channel.findOne({
                channelId,
                owner: req.user.userId
            });

            if (!channel) {
                return res.status(403).json({
                    message: "You can only move the video to your own channel"
                });
            }

            video.channelId = channelId;
        }
        if (uploadDate !== undefined) video.uploadDate = uploadDate;

        // Save the updated video.
        await video.save();

        // Get updated video with comments.
        await video.populate("comments");
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
           // Get the logged-in user's ID from JWT.
        const userId = req.user.userId;
          // Make sure the arrays exist.
        if (!video.likedBy) {
            video.likedBy = [];
        }

        if (!video.dislikedBy) {
            video.dislikedBy = [];
        }
    
        // Check whether this user already liked the video.
        const alreadyLiked = video.likedBy.includes(userId);

        if (alreadyLiked) {
            return res.status(400).json({
                message: "You already liked this video",
                video
            });
        }
                // Check whether the user previously disliked the video.
        const dislikeIndex = video.dislikedBy.indexOf(userId);

        if (dislikeIndex !== -1) {
            // Remove the user's dislike.
            video.dislikedBy.splice(dislikeIndex, 1);

            // Decrease the dislike count.
            if (video.dislikes > 0) {
                video.dislikes -= 1;
            }
        }

        // Add the user to likedBy.
        video.likedBy.push(userId);

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

        // Get the logged-in user's ID.
        const userId = req.user.userId;

        // Make sure likedBy exists.
        if (!video.likedBy) {
            video.likedBy = [];
        }

        // Find the user's ID in likedBy.
        const likeIndex = video.likedBy.indexOf(userId);
            // Check whether the user actually liked the video.
        if (likeIndex === -1) {
            return res.status(400).json({
                message: "You have not liked this video",
                video
            });
        }

        // Remove the user's like.
        video.likedBy.splice(likeIndex, 1);


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
        // Find the video using the custom videoId.
        const video = await Video.findOne({
            videoId: req.params.id
        });

        // Check whether the video exists.
        if (!video) {
            return res.status(404).json({
                message: "Video not found"
            });
        }

        // Check whether the logged-in user owns this video.
        if (String(video.uploader) !== String(req.user.userId)) {
            return res.status(403).json({
                message: "You can delete only your own video"
            });
        }

        // Delete the video after ownership is confirmed.
        await Video.deleteOne({
            videoId: req.params.id
        });

        // Send success response.
        res.status(200).json({
            message: "Video deleted successfully"
        });

    } catch (error) {

        // Send error response.
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
         // Get the logged-in user's ID.
        const userId = req.user.userId;

        // Make sure the arrays exist.
        if (!video.likedBy) {
            video.likedBy = [];
        }

        if (!video.dislikedBy) {
            video.dislikedBy = [];
        }
         // Check whether the user already disliked the video.
        const alreadyDisliked = video.dislikedBy.includes(userId);

        if (alreadyDisliked) {
            return res.status(400).json({
                message: "You already disliked this video",
                video
            });
        }

        // Check whether the user previously liked the video.
        const likeIndex = video.likedBy.indexOf(userId);

        if (likeIndex !== -1) {
            // Remove the user's like.
            video.likedBy.splice(likeIndex, 1);
        
           // Decrease the like count.
            if (video.likes > 0) {
                video.likes -= 1;
            }
        }

        // Add the user to dislikedBy.
        video.dislikedBy.push(userId);
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
         // Get the logged-in user's ID.
        const userId = req.user.userId;

         
        // Make sure dislikedBy exists.
        if (!video.dislikedBy) {
            video.dislikedBy = [];
        }

        // Find the user's dislike.
        const dislikeIndex = video.dislikedBy.indexOf(userId);

        // Check whether the user actually disliked the video.
        if (dislikeIndex === -1) {
            return res.status(400).json({
                message: "You have not disliked this video",
                video
            });
        }

        // Remove the user's dislike.
        video.dislikedBy.splice(dislikeIndex, 1);


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