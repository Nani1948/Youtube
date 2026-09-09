import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

// Video categories.
const categories = [
    "Education",
    "Technology",
    "Gaming",
    "Music",
    "Sports",
    "News"
];

// UploadVideo component.
function UploadVideo() {
    // Used to navigate to another page.
    const navigate = useNavigate();
    // Get the current logged-in user.
    const { user } = useAuth();
    // Store the user's channels.
    const [channels, setChannels] = useState([]);
    // Store video form data.
    const [formData, setFormData] = useState({
        title: "",
        thumbnailUrl: "",
        videoUrl: "",
        description: "",
        category: "Education",
        channelId: ""
    });
    // Store error message.
    const [error, setError] = useState("");
    // Store success message.
    const [success, setSuccess] = useState("");
    // Fetch channels owned by the current user.
    useEffect(() => {
        const fetchChannels = async () => {

            try {

                // Get all channels from the backend.
                const response = await api.get(
                    "/channels"
                );

                // Get only channels owned by the user.
                const ownChannels = response.data.filter(
                    (channel) =>
                        channel.owner === user.userId
                );

                // Store the user's channels.
                setChannels(ownChannels);

                // Select the first channel by default.
                if (ownChannels.length > 0) {
                    setFormData((previous) => ({
                        ...previous,
                        channelId:
                            ownChannels[0].channelId
                    }));
                }

            } catch (error) {
                // Display error message.
                setError(
                    "Failed to load channels"
                );
            }
        };

        // Fetch the user's channels.
        fetchChannels();

    }, [user.userId]);

    // Handle changes in form fields.
    const handleChange = (event) => {

        setFormData({
            ...formData,
            [event.target.name]:
                event.target.value
        });
    };

    // Handle video form submission.
    const handleSubmit = async (event) => {
        // Prevent page refresh.
        event.preventDefault();

        // Clear previous error message.
        setError("");

        // Check whether a channel is selected.
        if (!formData.channelId) {
            setError(
                "Please create/select a channel first"
            );

            return;
        }

        try {
            // Send video data to the backend.
            const response = await api.post(
                "/videos",
                {
                    ...formData,
                    uploader: user.userId,
                    uploadDate: new Date()
                }
            );

            // Display success message.
            setSuccess(
                "Video uploaded successfully"
            );

            // Navigate to the uploaded video page.
            setTimeout(() => {
                navigate(
                    `/video/${response.data.video.videoId}`
                );

            }, 700);

        } catch (error) {

            // Display upload error message.
            setError(
                error.response?.data?.message ||
                "Failed to upload video"
            );
        }
    };

    return (

        <div className="form-page">
            {/* Video upload form. */}
            <form
                className="data-form"
                onSubmit={handleSubmit}
            >

                <h2>Upload Video</h2>
                    

                {/* Display error message. */}
                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                {/* Display success message. */}
                {success && (
                    <p className="success-message">
                        {success}
                    </p>
                )}

                {/* Video title input. */}
                <input
                    name="title"
                    placeholder="Video Title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />

                {/* Thumbnail URL input. */}
                <input
                    name="thumbnailUrl"
                    placeholder="Thumbnail URL"
                    value={formData.thumbnailUrl}
                    onChange={handleChange}
                    required
                />

                {/* Video URL input. */}
                <input
                    name="videoUrl"
                    placeholder="Video URL"
                    value={formData.videoUrl}
                    onChange={handleChange}
                    required
                />

                {/* Video description input. */}
                <textarea
                    name="description"
                    placeholder="Video Description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />

                {/* Video category selection. */}
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                >
                    {categories.map((category) => (
                        <option
                            key={category}
                            value={category}
                        >
                            {category}
                        </option>
                    ))}
                </select>

                {/* Channel selection. */}
                <select
                    name="channelId"
                    value={formData.channelId}
                    onChange={handleChange}
                    required
                >
                    <option value="">
                        Select Channel
                    </option>

                    {channels.map((channel) => (
                        <option
                            key={channel.channelId}
                            value={channel.channelId}
                        >
                            {channel.channelName}
                        </option>
                    ))}
                </select>

                {/* Show message when the user has no channels. */}
                {channels.length === 0 && (
                    <p>
                        You need to create a channel
                        before uploading a video.
                    </p>
                )}

                {/* Upload video button. */}
                <button
                    type="submit"
                    disabled={channels.length === 0}
                >
                    Upload Video
                </button>

            </form>

        </div>
    );
}

// Export UploadVideo component.
export default UploadVideo;
