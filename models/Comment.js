import mongoose from "mongoose";

// Create Comment Schema
const commentSchema = new mongoose.Schema({
    videoId: {
    type: String,
    required: [true, "Video ID is required"],
    trim: true,
     default: () => new mongoose.Types.ObjectId().toString()
},

    // Comment ID
    commentId: {
        type: String,
        required: [true, "Comment ID is required"],
        unique: true,
        trim: true
    },

    // User who posted the comment
    userId: {
        type: String,
        required: [true, "User ID is required"],
        trim: true
    },

    // Comment text
    text: {
        type: String,
        required: [true, "Comment text is required"],
        trim: true
    },
    
    // Pinned video
    isPinned:{
        type:Boolean,
        default:false
    },
    
    // Comment timestamp
    timestamp: {
        type: Date,
        required: [true, "Comment timestamp is required"]
    }
});

// Create Comment model
const Comment = mongoose.model("Comment", commentSchema);

// Export Comment model
export default Comment;

