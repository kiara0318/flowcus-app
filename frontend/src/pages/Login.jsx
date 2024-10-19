import React from "react";

const Login = () => {
    const handleLoginWithSpotify = () => {
        // Redirect to backend login route
        window.location.href = "http://localhost:3000/login"; // Your backend will handle the redirection
    };

    return (
        <div>
            <h2>Login</h2>
            <button onClick={handleLoginWithSpotify}>{"Login with Spotify"}</button>
            <p>{"Don't have an account?"} <a href="/create-user">Sign Up</a></p>
        </div>
    );
};

export default Login;
