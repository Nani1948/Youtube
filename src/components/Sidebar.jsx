import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Sidebar component.
function Sidebar({ sidebarOpen }){
    // Get the current logged-in user.
    const { user } = useAuth();
    return (
        //Sidebar navigation section.
          <aside className={sidebarOpen ? "sidebar" : "sidebar sidebar-closed"}>

            <Link to="/">🏠 Home</Link>
            <Link to="/"> 🔥 Trending</Link>
            <Link to="/">📺 Subscriptions </Link>

            {/* Show additional links only when the user is logged in. */}
            {user && (
               <>
                    <hr />
                    <Link to="/create-channel"> ➕ Create Channel </Link>
                    <Link to="/upload-video">  ⬆ Upload Video</Link>
                </>

            )}

        </aside>
    );
}

// Export Sidebar component.
export default Sidebar;