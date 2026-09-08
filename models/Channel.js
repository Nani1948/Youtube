import mongoose from "mongoose";

// Create Channel Schema
const channelSchema = new mongoose.Schema({

    // Channel ID
    channelId: {
        type: String,
        required: [true, "Channel ID is required"],
        unique: true,
        trim: true,
         default: () => new mongoose.Types.ObjectId().toString()
    },

    // Channel name
    channelName: {
        type: String,
        required: [true, "Channel name is required"],
        trim: true
    },

    // Channel owner / User ID
    owner: {
        type: String,
        required: [true, "Owner is required"],
        trim: true
    },

    // Channel description
    description: {
        type: String,
        required: [true, "Channel description is required"],
        trim: true
    },

    // Channel banner URL
    channelBanner: {
        type: String,
        required: [true, "Channel banner is required"],
        trim: true
    },

    // Number of subscribers
    subscribers: {
        type: Number,
        default: 0,
        min: [0, "Subscribers cannot be negative"]
    },

    // Video IDs uploaded to the channel
    videos: {
        type: [String],
        default: []
    }
});

// Create Channel model
const Channel = mongoose.model("Channel", channelSchema);

// Export Channel model
export default Channel;