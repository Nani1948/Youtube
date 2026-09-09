import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Register component
function Register() {
    // Used to navigate to another page
    const navigate = useNavigate();

    // Get register function and loading state from AuthContext
    const { register, loading } = useAuth();

    // Store registration form data
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        avatar: ""
    });

    // Store error message
    const [error, setError] = useState("");

    // Store success message
    const [success, setSuccess] = useState("");

    // Handle input field changes
    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };
    
    // Handle form submission
    const handleSubmit = async (event) => {
        // Prevent page refresh
        event.preventDefault();

        // Clear previous messages
        setError("");
        setSuccess("");

        // Validate required fields
        if (
            !formData.username ||
            !formData.email ||
            !formData.password
        ) {
            // Show validation error
            setError("Please fill all required fields");
            return;
        }

        // Call register function from AuthContext
        const result = await register(formData);

        // Check whether registration was successful
        if (result.success) {
            // Show success message
            setSuccess(
                "Registration successful. Redirecting to login..."
            );

            // Navigate to login page after one second
            setTimeout(() => {
                navigate("/login");
            }, 1000);
        } else {
            // Show registration error
            setError(result.message);
        }
    };

    // Display registration page
    return (
        <div className="auth-page">
            {/* Registration form */}
            <form
                className="auth-form"
                onSubmit={handleSubmit}
            >
                {/* Form heading */}
                <h2>Create Account</h2>

                {/* Display error message */}
                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                {/* Display success message */}
                {success && (
                    <p className="success-message">
                        {success}
                    </p>
                )}

                {/* Username input */}
                <input
                    name="username"
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                />

                {/* Email input */}
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />

                {/* Password input */}
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />

                {/* Optional avatar URL input */}
                <input
                    name="avatar"
                    type="text"
                    placeholder="Avatar URL (optional)"
                    value={formData.avatar}
                    onChange={handleChange}
                />

                {/* Register button */}
                <button
                    type="submit"
                    disabled={loading}
                >
                    {/* Change button text while registering */}
                    {loading ? "Registering..." : "Register"}
                </button>

                {/* Link to login page */}
                <p>
                    Already have an account?{" "}
                    <Link to="/login">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}

// Export Register component
export default Register;