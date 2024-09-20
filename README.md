# Waffs Music Player

## Overview

**Waffs Music Player** is a full-stack online music player application built using JavaScript, featuring React for the frontend and Node.js for the backend, along with MongoDB for data storage. The application allows users to create playlists, search for songs, and control playback with features such as play, pause, skip, and volume control.

## Features

- User authentication (sign up, login, and logout)
- Create and manage playlists
- Search for songs using a music API
- Music playback controls: play, pause, skip, forward, rewind
- Responsive design for mobile and desktop devices

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **APIs**: [Last.fm API](https://www.last.fm/api)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)
- [Git](https://git-scm.com/) (for version control)

### Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:ongaro09/online-music-player.git
   cd online-music-player
2. Navigate to the backend directory and install dependencies:
cd backend
npm install

3. Create a .env file in the backend directory and add your MongoDB URI and JWT secret:
MONGODB_URI=mongodb://localhost:27017/music_player
JWT_SECRET=your_jwt_secret_here
LASTFM_API_KEY=your_lastfm_api_key_here

4. Start the backend server:
npm start

5. In a new terminal, navigate to the frontend directory and install dependencies:
cd frontend
npm install

6. Start the React application:
npm start

## Usage
Once both the backend and frontend servers are running, you can access the Waffs Music Player at http://localhost:3000. Users can sign up, log in, create playlists, and search for songs.