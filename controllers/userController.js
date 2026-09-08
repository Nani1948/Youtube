
import User from "../models/User.js";
// Get All Users
export const getUsers = async (req, res) => {
    try {

        // Find all users
        // select("-password") prevents password from being returned
        const users = await User.find().select("-password");

        // Send users as response
        res.status(200).json(users);

    }
    // Send error response if fetching users fails
    catch (error) {
        res.status(500).json({
            message: "Failed to fetch users",
            error: error.message
        });
    }
};


// Get User By ID
export const getUserById = async (req, res) => {
    try {

        // Find user using the userId from URL
        // Example: /users/user001
        const user = await User.findOne({
            userId: req.params.id
        }).select("-password");

        // Check whether user exists
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }


        // Send user details
        // Password is excluded

        res.status(200).json(user);

    } catch (error) {
        // Send error response
        res.status(500).json({
            message: "Failed to fetch user",
            error: error.message
        });
    }
};


// Update User
export const updateUser = async (req, res) => {
    try {
        // Find user using userId
        // Update the fields received in req.body
        const user = await User.findOneAndUpdate(
            { userId: req.params.id },
            req.body,
            {
                // Return the updated user

                new: true,
                runValidators: true
            }
        ).select("-password");

        // Check whether user exists
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Send updated user
        // Password is not returned
        res.status(200).json({
            message: "User updated successfully",
            user
        });

    } catch (error) {
        // Send error response
        res.status(400).json({
            message: "Failed to update user",
            error: error.message
        });
    }
};


// Delete User
export const deleteUser = async (req, res) => {
    try {
        // Find user using userId
        // Delete the user from MongoDB

        const user = await User.findOneAndDelete({
            userId: req.params.id
        });

        // Check whether user exists

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Send success response
        res.status(200).json({
            message: "User deleted successfully"
        });

    } catch (error) {
        // Send error response
        res.status(500).json({
            message: "Failed to delete user",
            error: error.message
        });
    }
};