import React, {useState} from "react";

/**
 * Component for creating a user and handling Spotify login.
 * @returns {JSX.Element} The rendered CreateUser component.
 *
 * @todo
 * - Implement a user creation form with fields for user information (e.g., username, email).
 * - On form submission, validate the input and store the user information in the database.
 * - Update the redirect URI to be configurable based on the environment.
 * - Add error handling for the login process.
 * - Implement a loading state while redirecting to Spotify.
 * - Consider providing user feedback upon successful login or error.
 */
const CreateUser = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    /**
     * Handles the Spotify login process by redirecting the user to the Spotify authorization page.
     */
    const handleSpotifyLogin = () => {
        const scope = "user-read-playback-state user-modify-playback-state";
        const redirectUri = process.env.REACT_APP_URL + "/callback"; // Update with your callback URL
        window.location.href = `https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.REACT_APP_SPOTIFY_CLIENT_ID}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirectUri)}`; // Redirect to Spotify login
    };

    /**
     * Handles the submission of the user creation form.
     * @param {Event} e - The form submission event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        // TODO: Add validation for username and email
        // TODO: Send a request to the backend to store user information in the database
        console.log("User created:", {username, email});
    };

    return (
        <div>
            <h2>Create User</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create User</button>
            </form>
            <p>Click the button below to log in with Spotify:</p>
            <button onClick={handleSpotifyLogin}>Log in with Spotify</button>
        </div>
    );
};

export default CreateUser;
