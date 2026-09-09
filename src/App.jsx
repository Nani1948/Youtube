import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VideoPlayer from "./pages/VideoPlayer";
import Channel from "./pages/Channel";
import CreateChannel from "./pages/CreateChannel";
import UploadVideo from "./pages/UploadVideo";
import EditVideo from "./pages/EditVideo";
import EditChannel from "./pages/EditChannel";
import "./App.css";

// Create App component.
function App() {
  // Store whether sidebar is open or closed. 
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // Store search text entered in Header. 
  const [search, setSearch] = useState("");
  // Toggle sidebar.
  const toggleSidebar = () => {
    setSidebarOpen((previous) => !previous);
  };
  return (
    <div className="app">

      <Header
        search={search}
        setSearch={setSearch}
        toggleSidebar={toggleSidebar}

      />

      <div className="main-layout">
        <Sidebar
          sidebarOpen={sidebarOpen} />

        <main
          className={
            sidebarOpen
              ? "main-content" : "main-content-full"
          }>
          <Routes>
            {/* Home page */}
            <Route
              path="/"
              element={<Home search={search} />}
            />
            {/* Login page */}
            <Route
              path="/login"
              element={<Login />}
            />
            {/* Registration page */}
            <Route
              path="/register"
              element={<Register />}
            />
            {/* Video player page*/}
            <Route
              path="/video/:id"
              element={<VideoPlayer />}
            />
            {/* Channel page.*/}
            <Route
              path="/channel/:id"
              element={<Channel />}
            />

            {/*Create Channel page */}
            <Route
              path="/create-channel"
              element={
                <ProtectedRoute>
                  <CreateChannel />
                </ProtectedRoute>
              }
            />
            {/* Edit Channel page */}
            <Route path="/edit-channel/:id"
              element={<ProtectedRoute>
                <EditChannel />
              </ProtectedRoute>} />
            {/* Upload Video page*/}
            <Route
              path="/upload-video"
              element={<ProtectedRoute>
                <UploadVideo />
              </ProtectedRoute>
              }
            />
            {/* Edit Video page*/}
            <Route
              path="/edit-video/:id"
              element={<ProtectedRoute>
                <EditVideo />
              </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}
// Export App
export default App;