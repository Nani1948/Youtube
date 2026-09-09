import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Channel from "../models/Channel.js";
import Video from "../models/Video.js";
import Comment from "../models/Comment.js";

dotenv.config();

// Connect to MongoDB and then insert sample data.
connectDB().then(() => {
    seedData();
});

// Insert sample data
const seedData = async () => {
    try {

        // Clear existing data
        await User.deleteMany({});
        await Channel.deleteMany({});
        await Video.deleteMany({});
        await Comment.deleteMany({});

        console.log("Existing data cleared");

        // Hash password
        const hashedPassword = await bcrypt.hash("password123", 10);

        // Create User
        const user = await User.create({
            userId: "user01",
            username: "Nandhini",
            email: "k.nandhu1@gmail.com",
            password: hashedPassword,
            avatar: "https://i.pravatar.cc/150?img=12",
            channels: ["channel01"]
        });

        // Create Channel
        const channel = await Channel.create({
            channelId: "channel01",
            channelName: "Code With John",
            channelBanner: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
            description: "Technology, programming and educational videos",
            owner: user.userId,
            subscribers: 1250
        });

        // Create Videos
        const videos = await Video.insertMany([

            // Education
            {
                videoId: "video01",
                title: "JavaScript Course for Beginners",
                description: "Learn JavaScript programming from the basics.",
                videoUrl: "https://www.youtube.com/watch?v=Zi-Q0t4gMC8",
                thumbnailUrl: "https://img.youtube.com/vi/Zi-Q0t4gMC8/maxresdefault.jpg",
                category: "Education",
                channelId: channel.channelId,
                uploader: user.userId,
                views: 714019,
                likes: 7800,
                dislikes: 100
            },

            // Technology
            {
                videoId: "video02",
                title: "React JS Tutorial",
                description: "Learn React and build modern web applications.",
                videoUrl: "https://www.youtube.com/watch?v=bMknfKXIFA8",
                thumbnailUrl: "https://img.youtube.com/vi/bMknfKXIFA8/maxresdefault.jpg",
                category: "Technology",
                channelId: channel.channelId,
                uploader: user.userId,
                views: 2500000,
                likes: 45000,
                dislikes: 500
            },

            // Gaming
            {
                videoId: "video03",
                title: "Gaming Highlights",
                description: "Watch exciting gaming highlights and gameplay.",
                videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
                category: "Gaming",
                channelId: channel.channelId,
                uploader: user.userId,
                views: 500000,
                likes: 25000,
                dislikes: 300
            },

            // Music
            {
                videoId: "video04",
                title: "Music Video",
                description: "Enjoy popular music and entertainment.",
                videoUrl: "https://www.youtube.com/watch?v=9bZkp7q19f0",
                thumbnailUrl: "https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg",
                category: "Music",
                channelId: channel.channelId,
                uploader: user.userId,
                views: 1000000,
                likes: 50000,
                dislikes: 500
            },

            // Sports
            {
                videoId: "video05",
                title: "Sports Highlights",
                description: "Latest sports highlights and exciting moments.",
                videoUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
                thumbnailUrl: "https://img.youtube.com/vi/aqz-KE-bpKQ/maxresdefault.jpg",
                category: "Sports",
                channelId: channel.channelId,
                uploader: user.userId,
                views: 250000,
                likes: 12000,
                dislikes: 200
            },

            // News
            {
                videoId: "video06",
                title: "Latest News Update",
                description: "Latest news and important updates.",
                videoUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
                thumbnailUrl: "https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg",
                category: "News",
                channelId: channel.channelId,
                uploader: user.userId,
                views: 150000,
                likes: 5000,
                dislikes: 100
            }
        ]);
        // Store the video IDs inside the channel document.
        await Channel.findOneAndUpdate(
            {
                channelId: channel.channelId

            },
            {
                videos: videos.map(video => video.videoId)
            }
        );
        // Create Comments

        const comments = await Comment.insertMany([
            {
                commentId: "comment01",
                videoId: videos[0].videoId,
                userId: user.userId,
                text: "This JavaScript tutorial is very useful.",
                timestamp: new Date(),
                isPinned: false
            },
            {
                commentId: "comment02",
                videoId: videos[1].videoId,
                userId: user.userId,
                text: "Great explanation of React.",
                timestamp: new Date(),
                isPinned: false
            },
            {
                commentId: "comment03",
                videoId: videos[2].videoId,
                userId: user.userId,
                text: "Amazing gaming video!",
                timestamp: new Date(),
                isPinned: false
            },
            {
                commentId: "comment04",
                videoId: videos[3].videoId,
                userId: user.userId,
                text: "Really good music.",
                timestamp: new Date(),
                isPinned: false
            },
            {
                commentId: "comment05",
                videoId: videos[4].videoId,
                userId: user.userId,
                text: "Great sports highlights.",
                timestamp: new Date(),
                isPinned: false
            },
            {
                commentId: "comment06",
                videoId: videos[5].videoId,
                userId: user.userId,
                text: "Thanks for the news update.",
                timestamp: new Date(),
                isPinned: false
            }
        ]);


        for (const comment of comments) {
            await Video.findOneAndUpdate(
                { videoId: comment.videoId },
                {
                    $push: {
                        comments: comment._id
                    }
                }
            );
        }
        console.log("Seed data inserted successfully");
        // Close MongoDB connection
        await mongoose.connection.close();

        console.log("MongoDB connection closed");

    } catch (error) {

        console.error("Seed data failed:", error.message);

        // Close MongoDB connection
        await mongoose.connection.close();
    }
};