import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

// Create EditChannel component.
function EditChannel() {
    // Get channel ID from the URL.
    const { id } = useParams();
    // Used to navigate to another page.
    const navigate = useNavigate();
    // Get logged-in user.
    const { user } = useAuth();
    // Store channel form data.
    const [formData, setFormData] = useState({
        channelName: "",
        description: "",
        channelBanner: ""
    });
      // Store error message.
    const [error, setError] = useState("");
    // Store loading state.
    const [loading, setLoading] = useState(true);

    // Get channel details.
    const fetchChannel = async () => {
        try {
            // Send GET request to backend.
            const response = await api.get(`/channels/${id}`);

            // Check whether the logged-in user owns the channel.
            if (!user || user.userId !== response.data.owner) {
                setError("You are not allowed to edit this channel");
                return;
            }

            // Put existing channel data into the form.
            setFormData({
                channelName: response.data.channelName,
                description: response.data.description,
                channelBanner: response.data.channelBanner
            });
        } catch (error) {
            // Display backend error message.
            setError(
                error.response?.data?.message ||
                "Failed to load channel"
            );
        } finally {
            // Stop loading.
            setLoading(false);
        }
    };

    // Fetch channel when page loads.
    useEffect(() => {
        fetchChannel();
    }, [id]);

    // Handle input changes.
    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    // Update channel.
    const handleSubmit = async (event) => {
        // Prevent page refresh.
        event.preventDefault();

        // Clear previous error.
        setError("");

        try {
            // Send PUT request to backend.
            await api.put(`/channels/${id}`, formData);

            // Go back to channel page.
            navigate(`/channel/${id}`);
        } catch (error) {
            // Display backend error message.
            setError(
                error.response?.data?.message ||
                "Failed to update channel"
            );
        }
    };

    // Show loading message.
    if (loading) {
        return (
            <div className="page-message">
                Loading channel...
            </div>
        );
    }

    // Show error message.
    if (error) {
        return (
            <div className="page-message error-message">
                {error}
            </div>
        );
    }

    return (
        <div className="form-page">
            <form
                className="data-form"
                onSubmit={handleSubmit}
            >
                <h2>Edit Channel</h2>

                <input
                    type="text"
                    name="channelName"
                    placeholder="Channel Name"
                    value={formData.channelName}
                    onChange={handleChange}
                    required
                />

                <textarea
                    name="description"
                    placeholder="Channel Description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="channelBanner"
                    placeholder="Channel Banner URL"
                    value={formData.channelBanner}
                    onChange={handleChange}
                    required
                />

                <button type="submit">
                    Update Channel
                </button>
            </form>
        </div>
    );
}

// Export EditChannel component.
export default EditChannel;
