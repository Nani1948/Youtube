import mongoose from "mongoose";

//Create  User Schema
const userSchema = new mongoose.Schema({
    // User ID
    userId: {
        type: String,
        unique: true,
        trim: true,
        default: () => new mongoose.Types.ObjectId().toString()
    },


    //User name
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        minlength: [3, "Username must be at least 3 characters"],
        maxlength: [30, "Username cannot exceed 30 characters"],
        unique: true

    },

    //User email
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please enter a valid email address"
        ]

    },

    //User password
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"]
    },

    //User profile image
    avatar: {
        type: String,
        default: "https://example.com/default-avatar.png",
        trim: true
    },

    // Channels owned by the user
    channels: 
        {
            type:[String],
            default:[]
        }
    
},
    {
        //Automatically creates createdAt and updatedAt
        timestamps: true,

    });


//Create User model
const User = mongoose.model("Users", userSchema);
//Export User model
export default User;
