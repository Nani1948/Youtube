import { useEffect, useState } from "react";
import api from "../api/axios";
import VideoCard from "../components/VideoCard";

// Available video categories.
const categories = [
    "All",
    "Education",
    "Technology",
    "Gaming",
    "Music",
    "Sports",
    "News"
];

// Home component.
function Home({ search }) {
    // Store videos from the backend.
    const [videos, setVideos] = useState([]);

    // Store selected category.
    const [selectedCategory, setSelectedCategory] =
        useState("All");
    // Store search text.
    //const [search, setSearch] = useState("");
    // Store loading status.
    const [loading, setLoading] = useState(true);
    // Store error message.
    const [error, setError] = useState("");

    // Fetch videos when the Home page loads.
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response =
                    await api.get("/videos");
                   // Check what the backend actually returned. 
                console.log("API RESPONSE:", response.data);
    
                //Make sure videos is ALWAYS an array.
                if (Array.isArray(response.data)) 
                { 
                    setVideos(response.data); 
                } 
                else if (Array.isArray(response.data.videos)) 
                {      
                    setVideos(response.data.videos); 
                } 
                else if (Array.isArray(response.data.data)) 
                { 
                    setVideos(response.data.data); 
                } 
                else 
                { 
                    setVideos([]);
                }

            } catch (error) {

                console.error(error);

                setError(
                    "Failed to load videos"
                );
                //Keep videos as an array if API fails.
                setVideos([]);

            } finally {

                setLoading(false);
            }
        };

        fetchVideos();

    }, []);

    
    // Filter videos by category and search text.
const filteredVideos = videos.filter((video) => {
    //Prevent errors if title/category is missing.
    const title = video.title || "";
    const category = video.category || "";

    const matchesCategory =
        selectedCategory === "All" ||
        category === selectedCategory;

    const matchesSearch =
        title.toLowerCase().includes((search || "").toLowerCase());

    return matchesCategory && matchesSearch;
});

    // Show loading message while videos are being fetched.
    if (loading) {

        return (
            <div className="page-message">
                Loading videos...
            </div>
        );
    }

    return (

        <div className="home-page">

           

            {/* Category filter buttons. */}
            <div className="category-buttons">

                {categories.map((category) => (

                    <button
                        key={category}
                        onClick={() =>
                            setSelectedCategory(category)
                        }
                        className={
                            selectedCategory === category
                                ? "active-category"
                                : ""
                        }
                    >
                        {category}
                    </button>

                ))}

            </div>

            {/* Display error message if fetching videos fails. */}
            {error && (

                <p className="error-message">
                    {error}
                </p>

            )}

            {/* Display filtered videos. */}
            <div className="video-grid">

                {filteredVideos.length === 0 ? (

                    <p>
                        No videos found.
                    </p>

                ) : (

                    filteredVideos.map((video) => (

                        <VideoCard
                            key={video.videoId ||
                                 video._id  }
                            video={video}
                        />

                    ))

                )}

            </div>

        </div>
    );
}

// Export Home component.
export default Home;
