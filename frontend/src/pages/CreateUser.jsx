import React from 'react';

const CreateUser = () => {
  const handleSpotifyLogin = () => {
    const scope = 'user-read-playback-state user-modify-playback-state';
    const redirectUri = process.env.REACT_APP_API_URL + '/callback'; // Update with your callback URL
      window.location.href = `https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.REACT_APP_SPOTIFY_CLIENT_ID}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirectUri)}`; // Redirect to Spotify login
  };

  return (
    <div>
      <h2>Create User</h2>
      <p>Click the button below to log in with Spotify:</p>
      <button onClick={handleSpotifyLogin}>Log in with Spotify</button>
    </div>
  );
};

export default CreateUser;
