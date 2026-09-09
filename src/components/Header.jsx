import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header({ search, setSearch, toggleSidebar }){
    // Get current user and logout function.
    const { user, logout } = useAuth();

    // Used to navigate to another page. 
    const navigate = useNavigate();
    // Logout user and go to login page. 
    const handleLogout = () => {
        logout();
        navigate("/login");

    };
    return (
        <header className="header">
            
            {/* Hamburger menu button */} 
                 <button className="menu-button" 
                 type="button" onClick={toggleSidebar} >
                 ☰ 
             </button>
            {/* Logo and Home link. */}
            <Link to="/" className="logo"> ▶ YouTube Clone </Link>

            <div className="search-section"> 
                <input type="text" 
                placeholder="Search videos..."
                value={search}
                onChange={(event) => setSearch(event.target.value)} 
                /> 

                <button type="button" className="search-button" > 
                🔍 </button> 
            </div>
            {/* Right side buttons. */}
            <div className="header-right">
                {/* Show different buttons based on login status. */}
                {user ? (
                   
                    <> {/*Logged-in user.*/}
                        <span className="welcome"> Hi, {user.username || user.name} </span>
                        <Link to="/upload-video" className="header-button" > Upload </Link>
                        <button onClick={handleLogout} className="logout-button" > Logout </button>
                    </>
                ) : (
                   
                    <>  {/*User is not logged in.*/}
                        <Link to="/login" className="header-button" > Login </Link>
                        <Link to="/register" className="header-button" > Register </Link>

                    </>
                )}

            </div>
        </header>
    );
}
// Export Header component. 
export default Header;
