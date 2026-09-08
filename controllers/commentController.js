import Comment from "../models/Comment.js";
import Video from "../models/Video.js";

// Create Comment
export const createComment = async (req, res) => {
    try {
            // Count existing comments
        const count = await Comment.countDocuments();

        // Generate comment ID automatically
        const commentId = `comment${String(count + 1).padStart(3, "0")}`;


        // Get comment details from request body
       const {
            videoId,
            userId,
            text,
            timestamp,
            isPinned
        } = req.body;

        // Create and save comment in MongoDB
        const comment = await Comment.create({
            commentId,
            videoId,
            userId,
            text,
            timestamp,
            isPinned
        });

        // Add comment to the video's comments array
        const video = await Video.findOneAndUpdate(
            // Find video using videoId
            { videoId: videoId },
            // Add comment reference to comments array
            { $push: { comments: comment._id } },
            // Return the updated video
            { new: true }
        );

        // Check whether video exists
        if (!video) {
            // Remove comment if video does not exist
            await Comment.findByIdAndDelete(comment._id);
            // Send error response
            return res.status(404).json({
                message: "Video not found"
            });
        }
        // Send successful response
        res.status(201).json({
            message: "Comment created successfully",
            comment
        });

        // Send error response if comment creation fails
    } catch (error) {
        res.status(400).json({
            message: "Failed to create comment",
            error: error.message
        });
    }
};


// Get All Comments
export const getComments = async (req, res) => {
    try {


        // Get all comments from MongoDB
        const comments = await Comment.find();
        // Send comments as response
        res.status(200).json(comments);


        // Send error response
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch comments",
            error: error.message
        });
    }
};


// Get Comment By ID
export const getCommentById = async (req, res) => {
    try {

        // Find comment using commentId
        // req.params.id comes from the URL
        const comment = await Comment.findOne({
            commentId: req.params.id
        });
        // Check whether comment exists
        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }
        // Send comment as response
        res.status(200).json(comment);

    }// Send error response
    catch (error) {
        res.status(500).json({
            message: "Failed to fetch comment",
            error: error.message
        });
    }
};


// Update Comment
export const updateComment = async (req, res) => {
    try {
        const comment = await Comment.findOneAndUpdate(
            { commentId: req.params.id },       // Find comment
            req.body,     // New data to update
            {
                // Return updated comment
                new: true,
                // Apply schema validation
                runValidators: true
            }
        );

        // Check whether comment exists
        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }
        // Send updated comment
        res.status(200).json({
            message: "Comment updated successfully",
            comment
        });

        // Send error response
    } catch (error) {
        res.status(400).json({
            message: "Failed to update comment",
            error: error.message
        });
    }
};


// Delete Comment
export const deleteComment = async (req, res) => {
    try {

        // Find comment using commentId
        // Delete comment from MongoDB

        const comment = await Comment.findOneAndDelete({
            commentId: req.params.id
        });


        // Check whether comment exists
        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        // Remove comment reference from Video
        await Video.updateMany(
            // Find videos containing this comment
            { comments: comment._id },

            // Remove comment reference
            { $pull: { comments: comment._id } }
        );

        // Send successful response
        res.status(200).json({
            message: "Comment deleted successfully"
        });
        // Send error response
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete comment",
            error: error.message
        });
    }
};
