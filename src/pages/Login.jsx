import { useState } from "react";
import {
    Link,
    useNavigate
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Login component.
function Login() {
    // Used to navigate to another page.
    const navigate = useNavigate();

    // Get login function and loading status from AuthContext.
    const { login, loading } = useAuth();

    // Store email entered by the user.
    const [email, setEmail] =
        useState("");

    // Store password entered by the user.
    const [password, setPassword] =
        useState("");

    // Store error message.
    const [error, setError] =
        useState("");
    // Handle login form submission.
    const handleSubmit = async (event) => {
        // Prevent page refresh.
        event.preventDefault();
        // Clear previous error message.
        setError("");
        // Check whether email and password are entered.
        if (!email || !password) {

            setError(
                "Please enter email and password"
            );

            return;
        }
        // Call login function with email and password.
        const result =
            await login(
                email,
                password
            );

        // Navigate to Home page after successful login.
        if (result.success) {
            navigate("/");
        } else {

            // Display login error message.
            setError(result.message);
        }
    };

    return (
        <div className="auth-page">
           {/* Login form. */}
            <form
                className="auth-form"
                onSubmit={handleSubmit}
            >
                <h2>Login </h2>
                {/* Display error message if an error occurs. */}
                {error && (

                    <p className="error-message">
                        {error}
                    </p>
                )}

                {/* Email input field. */}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(event) =>
                        setEmail(event.target.value)
                    }
                />

                {/* Password input field. */}
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(event) =>
                        setPassword(event.target.value)
                    }
                />

                {/* Login button. */}
                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Logging in..."
                        : "Login"}
                </button>

                {/* Link to registration page. */}
                <p>
                    Don't have an account?{" "}
                    <Link to="/register">  Register </Link>
                </p>
            </form>
        </div>
    );
}
// Export Login component.
export default Login;
