import { useEffect, useState } from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import CommentSection
    from "../components/CommentSection";

// VideoPlayer component.
function VideoPlayer() {
    // Get video ID from the URL.
    const { id } = useParams();
    // Used to navigate to another page.
    const navigate = useNavigate();
    // Get the current logged-in user.
    const { user } = useAuth();
    // Store video details.
    const [video, setVideo] =
        useState(null);

    // Store loading status.
    const [loading, setLoading] =
        useState(true);

    // Store error message.
    const [error, setError] =
        useState("");
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    // Fetch video details from the backend.
    const fetchVideo = async () => {
        try {
         setLoading(true);
          setError("");
         console.log("Fetching video ID:", id);

            // Get video using the video ID.
            const response =
                await api.get(
                    `/videos/${id}`
                );
               console.log("Video response:", response.data);
            // Store the video data.
            setVideo(response.data);

        } catch (error) {
            // Display error in the console.
            console.error( "Video fetch error:",
            error.response?.data || error.message);

            // Store error message.
            setError(
                "Failed to load video"
            );

        } finally {
            // Stop the loading state.
            setLoading(false);
        }
    };

    // Fetch the video when the ID changes.
    useEffect(() => {
        fetchVideo();
    }, [id]);

    // Check whether the user is logged in.
    const requireLogin = () => {
        if (!user) {
            // Redirect user to login page.
            navigate("/login");
            return false;
        }
        return true;
    };


    // Like or remove like from the video.
    const handleLike = async () => {
        // Stop if the user is not logged in.
        if (!requireLogin()) {
            return;
        }

        try {
            if (liked) {
                // Remove existing like.
                const response =
                    await api.post(
                        `/videos/${id}/remove-like`
                    );

                // Update video data.
                setVideo(response.data.video);

                // Change liked state.
                setLiked(false);
                return;

            } else {

                // If currently disliked, remove the dislike first. 
                if (disliked) {
                    // Add like.
                    const removeResponse =
                        await api.post(
                            `/videos/${id}/remove-dislike`
                        );

                    // Update video data.
                    setVideo(removeResponse.data.video);
                    // Remove dislike state.
                    setDisliked(false);
                }
                // Add the like. 
                const response = await api.post(`/videos/${id}/like`);
                // Update video data. 
                setVideo(response.data.video);
                // Change liked state. 
                setLiked(true);
                // Make sure disliked state is false.
                setDisliked(false);
                // Clear error. 
                setError("");
            }

        } catch (error) {
            // Display backend error. 
            console.error(error);
            setError(
                error.response?.data?.message ||
                "Failed to update like"
            );
        }
    };


    // Dislike or remove dislike from the video.
    const handleDislike = async () => {

        // Stop if the user is not logged in.
        if (!requireLogin()) {
            return;
        }

        try {
            if (disliked) {
                // Remove existing dislike.
                const removeResponse =
                    await api.post(
                        `/videos/${id}/remove-dislike`
                    );

                // Update video data.
                setVideo(removeResponse.data.video);

                // Change disliked state.
                setDisliked(false);
                return;

            } else {
                // If currently liked, remove the like first. 
                if (liked) {
                    // Add dislike.
                    const removeResponse =
                        await api.post(
                            `/videos/${id}/remove-like`
                        );

                    // Update video data.
                    setVideo(removeResponse.data.video);

                    // Remove like state.
                    setLiked(false);
                }
                // Add the dislike. 
                const response = await api.post(`/videos/${id}/dislike`);
                // Update video data.
                setVideo(response.data.video);
                // Change disliked state. 
                setDisliked(true);
                // Make sure liked state is false.
                setLiked(false);
                // Clear error. 
                setError("");
            }

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to update dislike"
            );
        }
    };
    // Show loading message while video is being fetched.
    if (loading) {
        return (
            <div className="page-message">
                Loading video...
            </div>
        );
    }

    // Show error when the video could not be loaded.
    if (error && !video) {
        return (
            <div className="page-message error-message">
                {error}
            </div>
        );
    }

    // Show message if the video does not exist.
    if (!video) {
        return (
            <div className="page-message">
                Video not found
            </div>
        );
    }
    // VIDEO PLAYER UI
    return (
        <div className="video-player-page">
            {/* Display error message if an action fails. */}
            {error && (
                <p className="error-message">
                    {error}
                </p>

            )}

            {/* Video player. */}
            {/* Play the video URL stored in MongoDB. */}
            {/*<video
                className="video-player"
                controls
                src={video.videoUrl}
                onError={() =>
                    setError("This video URL cannot be played.")
                }
            >
                Your browser does not support this video.
            </video>*/}
            <iframe
                className="video-player"
                width="100%"
                height="500"
                src={video.videoUrl.replace(
                    "https://www.youtube.com/watch?v=",
                    "https://www.youtube.com/embed/"
                )}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                ></iframe>
                {/* Display video title. */}
            <h1>
                {video.title}
            </h1>
            {/* Display channel name.*/}
            <p className="channel-name">
                Channel: {video.channelName || video.channelId}
            </p>
            {/* Display video details. */}
            <div className="video-details">
                <span>
                    {video.views ?? 0} views
                </span>
                <span>
                    Category: {video.category}
                </span>

            </div>

            {/* Video like and dislike actions. */}
            <div className="video-actions">
                <button onClick={handleLike}>
                    👍 Like {video.likes || 0}
                </button>

                <button onClick={handleDislike}>
                    👎 Dislike {video.dislikes || 0}
                </button>
            </div>

            {/* Display video description. */}
            <div className="description-box">

                <h3> Description</h3>
                <p> {video.description}</p>
            </div>

            {/* Display comments for the video. */}
            <CommentSection
                videoId={video.videoId}
                comments={video.comments || []}
                onCommentChange={fetchVideo}
            />

        </div>
    );
}

// Export VideoPlayer component.
export default VideoPlayer;
