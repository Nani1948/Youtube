import axios from "axios";

//Create a custom Axios instance
const api = axios.create({
    
    // Set the base URL for the backend API.
    baseURL: "http://localhost:5000/api",
    
    // Set the default HTTP header for requests.
    headers: {
        "Content-Type": "application/json"
    }
});
// Add a request interceptor.
api.interceptors.request.use(
    // This function receives the Axios request configuration.
    (config) => {
        // This function receives the Axios request configuration.
        const token = localStorage.getItem("token");

        // Check whether a token exists.
        if (token) {
            //Add the token to the Authorization header.
            config.headers.Authorization = `Bearer ${token}`;
        }
        // Return the modified request configuration. // Axios will then continue and send the request.
        return config;
    },
    // This function handles an error that occurs while preparing the request.
    (error) => {
        return Promise.reject(error);
    }
);

export default api;