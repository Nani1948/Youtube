import { createContext, useContext, useState } from "react";
import api from "../api/axios";

// Create an authentication context.
const AuthContext = createContext();
// Create the AuthProvider component.
export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(() => {
        // Get the saved user information from localStorage.
        const savedUser = localStorage.getItem("user");
        // If savedUser exists, convert the JSON string back into an object. // Otherwise, set the user value to null.
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // Create a loading state.

    const [loading, setLoading] = useState(false);
    // Function used to register a new user.
    const register = async (userData) => {
        // Start the loading state before sending the request.
        setLoading(true);

        try {
            // Send the registration data to the backend.
            const response = await api.post(
                "/auth/register",
                userData
            );
            // If registration is successful, return success information.
            return {
                success: true,
                message: response.data.message
            };

        } catch (error) {
            // If registration fails, return a failure response.
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Registration failed"
            };

        } finally {
            // Stop the loading state after the request finishes. 
            // This runs whether the request succeeds or fails.
            setLoading(false);
        }
    };
    // Function used to log in an existing user.
    const login = async (email, password) => {
        // Start the loading state.
        setLoading(true);

        try {
            // Send email and password to the backend login API.
            const response = await api.post(
                "/auth/login",
                {
                    email,
                    password
                }
            );
            // Extract the token and user information from the backend response.
            const { token, user } = response.data;
            // Save the authentication token in localStorage.
            localStorage.setItem("token", token);
            // Convert the user object into a JSON string and save it.
            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );
            // Update the React user state with the logged-in user.
            setUser(user);
            // Return a successful login response.
            return {
                success: true,
                message: response.data.message
            };

        } catch (error) {
            // If login fails, return a failure response.
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Login failed"
            };

        } finally {
            // Stop the loading state after the login request finishes.
            setLoading(false);
        }
    };
    // Function used to log out the current user.

    const logout = () => {
        // Remove the authentication token from localStorage.
        localStorage.removeItem("token");
        // Remove the saved user information from localStorage.
        localStorage.removeItem("user");
        // Clear the user from React state.
        setUser(null);
    };
// Provide authentication data and functions to all child components.
    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                register,
                login,
                logout
            }}
        >   {/* Render all components inside AuthProvider. */}
            {children}
        </AuthContext.Provider>
    );
};
// Custom hook used to access AuthContext easily from other components.
export const useAuth = () => {
    return useContext(AuthContext);
};