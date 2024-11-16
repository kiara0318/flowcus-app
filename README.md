# Flowcus

**Flowcus** is a task management application that combines productivity with music. It allows users to associate tasks
with specific songs from Spotify, making it easier to stay focused and motivated throughout the day. The app integrates
seamlessly with the Spotify API, offering a unique way to blend work with music.

## Features

- **Link Task with Song**: Each task can be linked to a specific Spotify song. When you start the task, the song plays,
  and the task is considered complete either when the song finishes or when you physically stop the song.
- **Daily Quote**: Every day, a motivational quote is pulled from [ZenQuotes API](https://zenquotes.io/api/today) to
  inspire you as you go about your tasks.
    - **Future Updates**: Users will soon be able to pull a different quote if they don’t like the current one or set
      their own custom quote.
- **Future Features**:
    - **Routines**: Users will soon be able to create routines, which are groups of tasks that can be worked through in
      sequence.
    - **Task/Playlist Association**: Tasks and routines will also be able to be associated with specific Spotify
      playlists in an upcoming update.

## Tech Stack

- **Frontend**: React
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **API**: Spotify API
- **Authentication**: OAuth (via Spotify)
- **Deployment**: Local (for development)

## Getting Started

### Prerequisites

To run Flowcus locally, you’ll need the following:

- Node.js (v14 or later)
- PostgreSQL (for the database)
- Spotify Developer Account (for API access)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/kiaraoliver/flowcus-app.git
   cd flowcus-app
   ```

2. **Install dependencies for both frontend and backend:**

   First, install the dependencies for the root project:

   ```bash
   npm install
   ```

   Then, run the following command to install the dependencies for the frontend:

   ```bash
   npm run install-frontend
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory with the following configuration:

    - **Backend (.env):**

      ```bash
      PORT=3000
      DATABASE_URL=your_postgresql_database_url
      SPOTIFY_CLIENT_ID=your_spotify_client_id
      SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
      ```

    - **Frontend (.env in the `frontend` directory):**

      ```bash
      PORT=3001
      REACT_APP_URL=http://localhost:3001
      REACT_APP_API_URL=http://localhost:3000
      REACT_APP_SPOTIFY_CLIENT_ID=your_spotify_client_id
      REACT_APP_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
      ```

   Make sure to replace `your_postgresql_database_url`, `your_spotify_client_id`, and `your_spotify_client_secret` with
   your actual values.

4. **Start the application:**

   From the main directory, run:

   ```bash
   npm start
   ```

   This will start both the backend server and frontend app concurrently, with the backend on `http://localhost:3000`
   and the frontend on `http://localhost:3001`.

5. **Access the app:**

   Navigate to `http://localhost:3001` in your browser to start using Flowcus.

### Usage

1. **Login with Spotify**: Click the "Login with Spotify" button to authenticate and grant access to your Spotify
   account.
2. **Create Tasks**: Once logged in, you can create tasks and assign them a Spotify song.
3. **Start Task**: When you start a task, the linked song will begin playing. The task is completed when the song
   finishes or when you stop the song manually.
4. **Daily Quote**: Every day, Flowcus fetches an inspirational quote to keep you motivated. You’ll see this quote
   displayed on the main page.
    - **Future Features**: Users will soon be able to request a different quote if they don’t like the one provided, or
      set their own custom quote.
5. **Future Features**:
    - Routines: You’ll soon be able to group tasks into routines that can be completed in sequence.
    - Task/Playlist Association: In a future release, tasks will also be able to be linked to specific Spotify
      playlists.

## License

This project is **All Rights Reserved**. You may view the project, but you may not copy, modify, distribute, or use it
in any way without explicit permission from the author.
