import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

// Channel component.
function Channel() {
    // Get channel ID from the URL.
    const { id } = useParams();
    // Get the current logged-in user.
    const { user } = useAuth();
    // Store channel details.
    const [channel, setChannel] = useState(null);
    // Store channel videos.
    const [videos, setVideos] = useState([]);
    // Store loading status.
    const [loading, setLoading] = useState(true);
    // Store error message.
    const [error, setError] = useState("");
    // Fetch channel and video details.
    const fetchChannel = async () => {

        try {
            // Get channel details from the backend.
            const channelResponse = await api.get(
                `/channels/${id}`
            );

            // Get all videos from the backend.
            const videosResponse = await api.get("/videos");

            // Store channel data.
            setChannel(channelResponse.data);

            // Filter videos that belong to this channel.
            const channelVideos = videosResponse.data.filter(
                (video) =>
                    video.channelId === id
            );

            // Store channel videos.
            setVideos(channelVideos);

        } catch (error) {
            // Display error in the console.
            console.error(error);
            // Store error message.
            setError(
                error.response?.data?.message ||
                "Failed to load channel"
            );

        } finally {
            // Stop the loading state.
            setLoading(false);
        }
    };

    // Fetch channel when the channel ID changes.
    useEffect(() => {
        fetchChannel();

    }, [id]);

    // Delete the current channel.
    const deleteChannel = async () => {
        // Ask the user for confirmation.
        const confirmed = window.confirm(
            "Delete this channel?"
        );

        // Stop if deletion is cancelled.
        if (!confirmed) {
            return;
        }

        try {
            // Delete the channel from the backend.
            await api.delete(
                `/channels/${id}`
            );

            // Redirect to the Home page.
            window.location.href = "/";

        } catch (error) {
            // Display delete error message.
            setError(
                error.response?.data?.message ||
                "Failed to delete channel"
            );
        }
    };

    // Delete a video from the channel.
    const deleteVideo = async (videoId) => {
        // Ask the user for confirmation.
        const confirmed = window.confirm(
            "Delete this video?"
        );

        // Stop if deletion is cancelled.
        if (!confirmed) {
            return;
        }

        try {
            // Delete the video from the backend.
            await api.delete(
                `/videos/${videoId}`
            );

            // Refresh channel data after deletion.
            fetchChannel();

        } catch (error) {
            // Display delete error message.
            setError(
                error.response?.data?.message ||
                "Failed to delete video"
            );
        }
    };

    // Show loading message while data is being fetched.
    if (loading) {
        return (
            <div className="page-message">
                Loading channel...
            </div>
        );
    }

    // Show message if the channel does not exist.
    if (!channel) {
        return (
            <div className="page-message">
                Channel not found
            </div>
        );
    }

    // Check whether the logged-in user owns the channel.
    const isOwner =
        user &&
        user.userId === channel.owner;
    return (
        <div className="channel-page">
            {/* Display error message. */}
            {error && (
                <p className="error-message"> {error}</p>
            )}

            {/* Display channel banner. */}
            <div className="channel-banner">
                <img
                    src={channel.channelBanner}
                    alt={channel.channelName}
                />
            </div>

            {/* Display channel information. */}
            <div className="channel-info">
                <h1> {channel.channelName}</h1>
                <p>{channel.description}</p>
                <p>
                    {channel.subscribers || 0}
                    {" "}subscribers
                </p>

                {/* Display owner actions. */}
                {isOwner && (
                    <div className="owner-actions">
                         <Link
                              to={`/edit-channel/${id}`}
                             className="action-link"
                            >
                            Edit Channel
                            </Link>
                        <Link
                            to="/upload-video"
                            className="action-link"> Upload Video
                        </Link>
                        <button onClick={deleteChannel}> Delete Channel</button>
                    </div>
                )}
            </div>
            {/* Display channel videos heading. */}
            <h2> Channel Videos</h2>


            {/* Display videos uploaded to the channel. */}
            <div className="video-grid">
                {videos.length === 0 ? (
                    <p>No videos uploaded yet.</p>
                ) : (videos.map((video) => (
                    <div className="channel-video-card"
                        key={video.videoId}>

                        {/* Link to the video player page. */}
                        <Link to={`/video/${video.videoId}`}>
                            <img
                                src={video.thumbnailUrl}
                                alt={video.title}
                            />
                            <h3>{video.title}</h3>
                        </Link>

                        {/* Display edit and delete actions for the owner. */}
                        {isOwner && (
                            <div className="owner-actions">
                                <Link to={`/edit-video/${video.videoId}`}> Edit</Link>
                                <button onClick={() => deleteVideo(video.videoId)}>
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                ))
                )}
            </div>
        </div>
    );
}

// Export Channel component.
export default Channel;
