import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

// Video categories.
const categories = [
    "Education",
    "Technology",
    "Gaming",
    "Music",
    "Sports",
    "News"
];

// EditVideo component.
function EditVideo() {
    // Get video ID from the URL.
    const { id } = useParams();
    // Used to navigate to another page.
    const navigate = useNavigate();
    // Store video form data.
    const [formData, setFormData] = useState({
        title: "",
        thumbnailUrl: "",
        videoUrl: "",
        description: "",
        category: ""
    });
    // Store loading status.
    const [loading, setLoading] = useState(true);
    // Store error message.
    const [error, setError] = useState("");
    // Store success message.
    const [success, setSuccess] = useState("");

    // Fetch video details when the page loads.
    useEffect(() => {
        const fetchVideo = async () => {
            try {
                // Get video details from the backend.
                const response = await api.get(
                    `/videos/${id}`
                );

                // Store the received video data.
                const video = response.data;

                // Fill the form with existing video details.
                setFormData({
                    title: video.title || "",
                    thumbnailUrl: video.thumbnailUrl || "",
                    videoUrl: video.videoUrl || "",
                    description: video.description || "",
                    category: video.category || ""
                });

            } catch (error) {
                // Display error message.
                setError(
                    "Failed to load video"
                );

            } finally {
                // Stop the loading state.
                setLoading(false);
            }
        };

        // Fetch video details.
        fetchVideo();

    }, [id]);

    // Handle changes in form fields.
    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]:
                event.target.value
        });
    };

    // Handle video update submission.
    const handleSubmit = async (event) => {
        // Prevent page refresh.
        event.preventDefault();
        try {
            // Send updated video data to the backend.
            await api.put(
                `/videos/${id}`,
                formData
            );

            // Display success message.
            setSuccess(
                "Video updated successfully"
            );

            // Navigate to the video page after updating.
            setTimeout(() => {
                navigate(
                    `/video/${id}`
                );
            }, 700);

        } catch (error) {
            // Display update error message.
            setError(
                error.response?.data?.message ||
                "Failed to update video"
            );
        }
    };

    // Show loading message while video is being fetched.
    if (loading) {
        return (
            <div className="page-message">
                Loading...
            </div>
        );
    }

    return (
        <div className="form-page">
            {/* Video edit form. */}
            <form
                className="data-form"
                onSubmit={handleSubmit}
            >
                <h2> Edit Video </h2>

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
                    required
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

                {/* Update video button. */}
                <button type="submit">
                    Update Video
                </button>

            </form>

        </div>
    );
}

// Export EditVideo component.
export default EditVideo;

