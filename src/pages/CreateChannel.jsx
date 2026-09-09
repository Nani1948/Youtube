import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

// CreateChannel component.
function CreateChannel() {
    // Used to navigate to the channel page.
    const navigate = useNavigate();
    // Store channel form data.
    const [formData, setFormData] = useState({
        channelName: "",
        description: "",
        channelBanner: ""
    });

    // Store error message.
    const [error, setError] = useState("");

    // Store success message.
    const [success, setSuccess] = useState("");

    // Handle changes in form fields.
    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    // Handle channel form submission.
    const handleSubmit = async (event) => {
        // Prevent page refresh.
        event.preventDefault();

        // Clear previous error message.
        setError("");

        try {
            // Send channel data to the backend.
            const response = await api.post(
                "/channels",
                formData
            );

            // Display success message.
            setSuccess(
                "Channel created successfully"
            );

            // Navigate to the created channel page.
            setTimeout(() => {

                navigate(
                    `/channel/${response.data.channel.channelId}`
                );

            }, 500);

        } catch (error) {

            // Display error message.
            setError(
                error.response?.data?.message ||
                "Failed to create channel"
            );
        }
    };

    return (

        <div className="form-page">

            {/* Channel creation form. */}
            <form
                className="data-form"
                onSubmit={handleSubmit}
            >

                <h2> Create Channel</h2>

                {/* Display error message. */}
                {error && (
                    <p className="error-message">{error}</p>
                )}

                {/* Display success message. */}
                {success && (
                    <p className="success-message"> {success} </p>
                )}

                {/* Channel name input. */}
                <input
                    name="channelName"
                    placeholder="Channel Name"
                    value={formData.channelName}
                    onChange={handleChange}
                    required
                />

                {/* Channel description input. */}
                <textarea
                    name="description"
                    placeholder="Channel Description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />

                {/* Channel banner URL input. */}
                <input
                    name="channelBanner"
                    placeholder="Channel Banner URL"
                    value={formData.channelBanner}
                    onChange={handleChange}
                    required
                />

                {/* Create channel button. */}
                <button type="submit">
                    Create Channel
                </button>
            </form>
        </div>
    );
}

// Export CreateChannel component.
export default CreateChannel;

