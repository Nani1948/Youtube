import mongoose from "mongoose";


// Create Video Schema
const videoSchema = new mongoose.Schema({
    //Create a Video ID
    videoId: {
        type: String,
        required: [true, "Video ID is required"],
        unique: true,
        trim: true,
        default: () => new mongoose.Types.ObjectId().toString()
    },
    //Title video
    title: {
        type: String,
        required: [true, "Video title is required"],
        trim: true
    },
    //Thumbnail URL
    thumbnailUrl: {
        type: String,
        required: [true, "Thumbnail URL is required"],
        trim: true
    },
    //Video URL
    videoUrl: {
        type: String,
        required: [true, "Video URL is required"],
        trim: true
    },
    //Descripition
    description: {
        type: String,
        required: [true, "Video description is required"],
        trim: true
    },
    // Video category
    category: {
        type: String,
        required: [true, "Video category is required"],
        trim: true,
        enum: [
            "Education",
            "Technology",
            "Gaming",
            "Music",
            "Sports",
            "News"

        ]
    },
    //Channel ID
    channelId: {
        type: String,
        required: [true, "Channel ID is required"],
        trim: true
    },
    //Upload video
    uploader: {
        type: String,
        required: [true, "Uploader is required"],
        trim: true
    },
    //View video
    views: {
        type: Number,
        default: 0,
        min: 0
    },
    //Like video
    likes: {
        type: Number,
        default: 0,
        min: 0
    },
    //Dislike video
    dislikes: {
        type: Number,
        default: 0,
        min: 0
    },
     likedBy: [
        {
            type: String
        }
    ],

    dislikedBy: [
        {
            type: String
        }
    ],
    //Upload date
    uploadDate: {
        type: Date,
        default: Date.now,
        required: [true, "Upload date is required"]
    },

    // Pinned video
    isPinned: {
        type: Boolean,
        default: false
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