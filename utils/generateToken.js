import jwt from "jsonwebtoken";

// Generate JWT Token
const generateToken = (user) => {

    // Create token with user information
    const token = jwt.sign(
        {
            userId: user.userId,
            username: user.username,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );

    // Return token
    return token;
};

export default generateToken;