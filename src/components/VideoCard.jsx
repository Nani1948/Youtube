import { Link } from "react-router-dom";

function VideoCard({ video }) {

    return (
        // Link to the selected video.
        <Link
            to={`/video/${video.videoId}`}
            className="video-card"
        >

            <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="thumbnail"
            />

            <div className="video-info">
                {/* Display video title. */}
                <h3 className="video-title">{video.title}</h3>
                {/* Display channel name. */}
                <p className="channel-name">

                    {video.channelName || video.channelId}
                </p>
                {/* Display video views. */}
                <p className="video-views">
                    {Number(video.views || 0).toLocaleString()} views
                </p>
            </div>
        </Link>
    );
}
// Export VideoCard component.
export default VideoCard;