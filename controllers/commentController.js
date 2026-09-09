import Comment from "../models/Comment.js";
import Video from "../models/Video.js";

// Create Comment
export const createComment = async (req, res) => {
    try {


        // Get comment details from request body
        const {
            videoId,
            text,
            timestamp,
            isPinned
        } = req.body;

        // Check whether the video exists. 
        const video = await Video.findOne({
            videoId: videoId 
        }); 
        // Stop if the video does not exist.
         if (!video) { 
          return res.status(404).json(
         { message: "Video not found" });
         }
          // Get the last comment. 
        const lastComment = await Comment.findOne() 
        .sort({ commentId: -1 }); 
        // Start the comment number from 1.
         let nextNumber = 1; 
         // Check whether an existing comment was found.
         if (lastComment) {
         // Remove "comment" and convert the number to an integer.
          const lastNumber = parseInt( 
            lastComment.commentId.replace("comment", ""), 10 );

          //Increase the number by 1. 
          nextNumber = lastNumber + 1; } 
        // Generate the next comment ID. 
        const commentId = `comment${String(nextNumber).padStart(3, "0")}`;
        // Create and save comment in MongoDB
        const userId = req.user.userId;
        const comment = await Comment.create({
            commentId,
            videoId,
            userId,
            text,
            timestamp,
            isPinned
        });

        // Add comment to the video's comments array
          await Video.findOneAndUpdate(
            // Find video using videoId
            { videoId: videoId },
            // Add comment reference to comments array
            { $push: { comments: comment._id } },
            // Return the updated video
            { new: true }
        );

        
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



        // Find comment
        const comment = await Comment.findOne(
            { commentId: req.params.id }
        );

        // Check whether comment exists
        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }
        // Check comment owner
        if (String(comment.userId) !== String(req.user.userId)) {
            return res.status(403).json({
                message: "You can update only your own comment"
            });
        }
        // Update comment text
        comment.text = req.body.text;

        // Save updated comment
        await comment.save();
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

        const comment = await Comment.findOne({
            commentId: req.params.id
        });


        // Check whether comment exists
        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }
        // Check comment owner
        if (String(comment.userId) !== String(req.user.userId)) {
            return res.status(403).json({
                message: "You can delete only your own comment"
            });
        }

        // Delete comment from MongoDB
        await Comment.findByIdAndDelete(comment._id);

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
