import mongoose from "mongoose";


// Create Video Schema
const videoSchema = new mongoose.Schema({

    videoId: {
        type: String,
        required: [true, "Video ID is required"],
        unique: true,
        trim: true,
         default: () => new mongoose.Types.ObjectId().toString()
    },

    title: {
        type: String,
        required: [true, "Video title is required"],
        trim: true
    },

    thumbnailUrl: {
        type: String,
        required: [true, "Thumbnail URL is required"],
        trim: true
    },

    videoUrl: {
        type: String,
        required: [true, "Video URL is required"],
        trim: true
    },

    description: {
        type: String,
        required: [true, "Video description is required"],
        trim: true
    },

    channelId: {
        type: String,
        required: [true, "Channel ID is required"],
        trim: true
    },

    uploader: {
        type: String,
        required: [true, "Uploader is required"],
        trim: true
    },

    views: {
        type: Number,
        default: 0
    },

    likes: {
        type: Number,
        default: 0
    },

    dislikes: {
        type: Number,
        default: 0
    },

    uploadDate: {
        type: Date,
        required: [true, "Upload date is required"]
    },
    
    // Pinned video
    isPinned:{
        type:Boolean,
        default:false
    },
    // Reference Comment model
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

const Video = mongoose.model("Video", videoSchema);

export default Video;