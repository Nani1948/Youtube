import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import channelRoutes from "./routes/channelRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

//Load environment variables
dotenv.config();

//Connect MongoDB
connectDB();

//Create a Express
const app=express();

//Enable CORS -Logging and Security
app.use(cors());

//Parse JSON request body
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/channels",channelRoutes);
app.use("/api/videos",videoRoutes);
app.use("/api/comments",commentRoutes);

//Test route
app.get("/",(req,res) =>{
    res.status(200).json({
        message:"Youtube Clone API is running"
    });
});

//Get port form .env
 const PORT=process.env.PORT || 5000;

 //Start server
 app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
 });
