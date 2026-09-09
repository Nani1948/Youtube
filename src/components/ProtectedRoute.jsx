import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
    // Get the current logged-in user.
    const { user } = useAuth();
    
    // Redirect to login if the user is not logged in. 
     if (!user) 
    { 
        return ( 
        <Navigate to="/login" replace /> 
    );
}
    // Display the protected page for logged-in users. 
    return children;
}
// Export ProtectedRoute component. 
export default ProtectedRoute;