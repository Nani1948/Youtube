import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

// Register a new user
export const registerUser = async (req, res) => {
    try {

        // Get user details from request body
        const { username, email, password, avatar } = req.body;

         // Check whether required fields are provided
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Username, email and password are required"
            });
        }


        // Check whether username already exists
        const existingUsername = await User.findOne({ username });

        // If username exists, return error
        if (existingUsername) {
            return res.status(400).json({
                message: "Username already exists"
            });
        }

        // Check if email already exists,
        const existingEmail = await User.findOne({ email });
        // If email exists, return error
        if (existingEmail) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        // Hash the password before storing it
        // 10 is the salt rounds
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a unique user ID automatically
        const userId = `user_${Date.now()}`;
        // Create and save user in MongoDB
        const user = await User.create({
            userId,
            username,
            email,
            password: hashedPassword,
            avatar
        });
        // Send successful registration response
        res.status(201).json({
            message: "User registered successfully",
            user: {
                userId: user.userId,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                channels: user.channels
            }
        });

    } catch (error) {
        // Send error response if registration fails
        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
};

// Login an existing user
export const loginUser = async (req, res) => {
    try {
        // Get email and password from request body
        const { email, password } = req.body;

        //    // Check whether required fields are provided
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user using email
        const user = await User.findOne({ email });
        // Check whether user exists
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Compare entered password with hashed password
        // stored in MongoDB
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );


        // Check whether password is correct
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Generate JWT token after successful login
        const token = generateToken(user);

        // Send successful login response
        res.status(200).json({
            message: "Login successful",
            token,
            // Send JWT token to client
            user: {
                userId: user.userId,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                channels: user.channels
            }
        });

        // Send error response if login fails
    } catch (error) {
        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
};