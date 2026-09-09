# YouTube Clone - MERN Stack
A full-stack YouTube Clone application developed using the **MERN Stack**:
* MongoDB
* Express.js
* React.js
* Node.js
The application allows users to register, log in, create channels, upload videos, watch videos, search videos, filter videos by category, like/dislike videos, and manage comments.


## Project Overview
This project is a YouTube-like video-sharing platform built as a MERN Stack capstone project.

The application contains:

* User authentication
* JWT-based authorization
* Home page
* Video search
* Category filtering
* Video player
* Like and dislike functionality
* Comment CRUD operations
* Channel creation
* Video CRUD operations
* Responsive design
* MongoDB data storage
* Seed data

# Technologies Used
## Frontend
* React.js
* Vite
* React Router DOM
* Axios
* HTML5
* CSS3

## Backend
* Node.js
* Express.js
* MongoDB
* Mongoose
* JSON Web Token (JWT)
* bcrypt
## Development Tools
* Visual Studio Code
* Git
* GitHub
* MongoDB
* MongoDB Compass
* Postman

# Project Structure

youtube
│
├── frontend/
│   │
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   │
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── VideoCard.jsx
│   │   │   ├── CommentSection.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── VideoPlayer.jsx
│   │   │   ├── Channel.jsx
│   │   │   ├── CreateChannel.jsx
│   │   │   ├── EditChannel.jsx
│   │   │   ├── UploadVideo.jsx
│   │   │   └── EditVideo.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── package.json
│   └── index.html
│
└── backend/
    │
    ├── config/
    │   └── db.js
    │
    ├── controllers/
    │   ├── authController.js
    │   ├── userController.js
    │   ├── channelController.js
    │   ├── videoController.js
    │   └── commentController.js
    │
    ├── middleware/
    │   ├── authMiddleware.js
    │   └── errorMiddleware.js
    │
    ├── models/
    │   ├── User.js
    │   ├── Channel.js
    │   ├── Video.js
    │   └── Comment.js
    │
    ├── routes/
    │   ├── authRoutes.js
    │   ├── userRoutes.js
    │   ├── channelRoutes.js
    │   ├── videoRoutes.js
    │   └── commentRoutes.js
    │
    ├── seed/
    │   └── seedData.js
    │
    ├── utils/
    │   └── generateToken.js
    │
    ├── .env
    ├── package.json
    └── server.js
`

# Features
## 1. User Registration

Users can create a new account using:
* Username
* Email
* Password
The application validates the registration information.
After successful registration, the user is redirected to the login page.

## 2. User Login
Registered users can log in using their credentials.
After successful login:

* JWT token is generated.
* User information is stored in local storage.
* User is redirected to the home page.
* The header displays the logged-in user's name.

## 3. JWT Authentication
The application uses JSON Web Tokens for authentication.
Protected operations require a valid JWT token.
Examples:
* Create channel
* Upload video
* Edit video
* Delete video
* Add comment
* Edit comment
* Delete comment
* Like video
* Dislike video

The frontend sends the token using the Authorization header:

Authorization: Bearer <token>

# Home Page
The home page provides a YouTube-like interface.

It contains:

* Header
* Hamburger menu
* Sidebar
* Search bar
* Category filter buttons
* Video cards
* Video thumbnails
* Video titles
* Channel information
* View count

Videos are loaded dynamically from MongoDB through the backend API.

#Search Functionality

Users can search videos by title.
Example:
JavaScript

The application displays videos matching the search text.


# Category Filter

Users can filter videos by category.

Example categories:

* All
* Music
* Gaming
* Education
* Programming
* Sports
* Entertainment

Selecting a category displays videos belonging to that category.

# Video Player

Clicking a video opens the video player page.

The page displays:

* Video player
* Video title
* Channel name
* Views
* Category
* Description
* Like button
* Dislike button
* Comments

# Like and Dislike

Logged-in users can interact with videos using:

text
👍 Like
👎 Dislike

The application supports:

* Add Like
* Remove Like
* Add Dislike
* Remove Dislike
* Switch from Like to Dislike
* Switch from Dislike to Like

The counts are stored in MongoDB.

# Comments

Users can add comments to videos.

Comment functionality includes:

* Create comment
* View comments
* Edit own comment
* Delete own comment
Comments are stored in MongoDB.
Users cannot edit or delete another user's comments.


# Channel Management

Logged-in users can create their own channel.

A channel contains information such as:

* Channel ID
* Channel name
* Description
* Owner

Users can manage their own channel.

# Video Management
Channel owners can manage their videos.
Video CRUD operations include:

### Create
Upload a new video.
### Read
Display videos belonging to the channel.
### Update
Edit video information.
### Delete
Delete the user's own video.
Video information includes:
* Video ID
* Title
* Thumbnail URL
* Video URL
* Description
* Category
* Channel ID
* Uploader
* Upload date
* Views
* Likes
* Dislikes
* Comments


# Responsive Design

The application supports:

* Desktop
* Tablet
* Mobile

Responsive CSS is used for:

* Header
* Sidebar
* Search area
* Category buttons
* Video grid
* Video player
* Forms
* Channel pages
* Comment section

---

# Database

MongoDB is used as the database.

The application contains the following collections:

```text
users
channels
videos
comments
```

---

# Database Relationships

## User → Channel

A user can own a channel.

```text
User
  ↓
Channel
```

## Channel → Video

A channel can contain multiple videos.

```text
Channel
  ↓
Videos
```

## Video → Comments

A video can contain multiple comments.

```text
Video
  ↓
Comments
```

---

# Seed Data

The backend contains seed data for testing.

Seed data can contain:

```text
Users
Channels
Videos
Comments
```

This allows the application to be tested immediately without manually creating all records.

Run the seed script from the backend directory:

```bash
node seed/seedData.js
```

Make sure MongoDB is running before executing the seed script.

---

# Environment Variables

## Backend

Create a `.env` file inside the `backend` folder.

Example:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/youtube_clone
JWT_SECRET=your_secret_key
```

Do not upload the real `.env` file to GitHub.

---

## Frontend

Create a `.env` file inside the `frontend` folder.

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

---

# Installation

## Step 1: Clone the Repository

```bash
git clone <your-github-repository-url>
```

Move into the project directory:

```bash
cd youtube-clone
```

---

# Backend Setup

Open the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Start the backend server:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

---

# Frontend Setup

Open another terminal.

Move into the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

Open the displayed Vite URL in the browser.

---

# API Endpoints

## Authentication

### Register

```http
POST /api/auth/register
```

### Login

```http
POST /api/auth/login
```

---

# Video APIs

### Get all videos

```http
GET /api/videos
```

### Get video by ID

```http
GET /api/videos/:id
```

### Create video

```http
POST /api/videos
```

Requires authentication.

### Update video

```http
PUT /api/videos/:id
```

Requires authentication.

### Delete video

```http
DELETE /api/videos/:id
```

Requires authentication.

---

# Like APIs

### Like video

```http
POST /api/videos/:id/like
```

Requires authentication.

### Remove Like

```http
POST /api/videos/:id/remove-like
```

Requires authentication.

---

# Dislike APIs

### Dislike video

```http
POST /api/videos/:id/dislike
```

Requires authentication.

### Remove Dislike

```http
POST /api/videos/:id/remove-dislike
```

Requires authentication.

---

# Comment APIs

### Get comments

```http
GET /api/comments
```

### Get comment by ID

```http
GET /api/comments/:id
```

### Create comment

```http
POST /api/comments
```

Requires authentication.

### Update comment

```http
PUT /api/comments/:id
```

Requires authentication.

### Delete comment

```http
DELETE /api/comments/:id
```

Requires authentication.

---

# Channel APIs

### Get channels

```http
GET /api/channels
```

### Get channel by ID

```http
GET /api/channels/:id
```

### Create channel
POST /api/channels
Requires authentication.

### Update channel
PUT /api/channels/:id
Requires authentication.

### Delete channel
DELETE /api/channels/:id
Requires authentication.

# Testing
The backend APIs can be tested using Postman.
The frontend can be tested using the browser.
Important test scenarios include:

### Authentication
* Register new user
* Login with valid credentials
* Login with invalid credentials
* Access protected operation without login

### Video
* Create video
* View video
* Edit own video
* Delete own video
* Try editing another user's video

### Comments
* Add comment
* Edit own comment
* Delete own comment
* Try editing another user's comment

### Like / Dislike
* Like video
* Remove like
* Dislike video
* Remove dislike
* Switch between like and dislike
### Search
* Search by video title
* Search for a non-existing video

### Category
* Select different categories
* Verify matching videos are displayed

### Responsive
Test the application on:
* Desktop
* Tablet
* Mobile

# Error Handling
The application handles common errors such as:
* Invalid login credentials
* Invalid registration data
* Missing authentication token
* Invalid or expired JWT
* Video not found
* Comment not found
* Unauthorized update
* Unauthorized delete
* Invalid video URL
* Empty comments

# Git and GitHub
Git is used for version control.
The project is divided into:
frontend
backend
Changes should be committed regularly with meaningful commit messages.

# Security
The application uses JWT authentication to protect user-specific operations.
Passwords are hashed before being stored in MongoDB.
Users can only modify or delete their own:

* Channels
* Videos
* Comments
The JWT token is used to identify the logged-in user on protected requests.

# How to Run the Complete Project
### Terminal 1 - Backend
cd backend
npm install
npm run dev

### Terminal 2 - Frontend
cd frontend
npm install
npm run dev

Then open the Vite frontend URL in the browser.
# Demo Flow
A typical demonstration flow is:
Register
   ↓
Login
   ↓
Home Page
   ↓
Search / Category Filter
   ↓
Open Video
   ↓
Like / Dislike
   ↓
Add Comment
   ↓
Edit Comment
   ↓
Delete Comment
   ↓
Create Channel
   ↓
Upload Video
   ↓
Edit Video
   ↓
Delete Video

# Future Improvements
Possible future improvements include:
* User profile pictures
* Video playlists
* Subscriptions
* Watch history
* Notifications
* Video recommendations
* Persistent per-user Like/Dislike reactions
* Video upload storage
* Pagination
* Advanc

# Conclusion
This project demonstrates a full-stack YouTube Clone using the MERN Stack.
It integrates:
* React frontend
* Node.js backend
* Express REST APIs
* MongoDB database
* Mongoose
* JWT authentication
* CRUD operations
* Search and filtering
* Responsive design
The project provides an end-to-end video-sharing application with authentication, channels, videos, comments, and user interactions.
Github:https://github.com/Nani1948/Youtube.git
Author:Nandhini
