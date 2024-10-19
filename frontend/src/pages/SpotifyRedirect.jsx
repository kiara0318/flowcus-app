import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";

const SpotifyRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Extract access token from URL parameters
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get("access_token");

        // Check if access token is present
        if (accessToken) {
            // Store access token in local storage
            localStorage.setItem("spotifyAccessToken", accessToken);
            fetchUserInfo(accessToken);
        } else {
            // If access token is missing, log an error and redirect to create user page
            console.error("Access token missing in URL; redirecting to create-user.");
            navigate("/create-user");
        }
    }, [navigate]);

    /**
     * Fetches user information from Spotify using the provided access token.
     *
     * @param {string} accessToken - The Spotify access token.
     * @async
     */
    const fetchUserInfo = async (accessToken) => {
        try {
            const response = await fetch("https://api.spotify.com/v1/me", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Check if the response is ok
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Failed to fetch user info:", errorData);
                throw new Error("Failed to fetch user info");
            }

            // Parse the user information
            const userInfo = await response.json();
            checkUserExistsInDB(userInfo.id);
        } catch (error) {
            // Handle any errors during the fetch and redirect to create user page
            console.error("Error fetching user info from Spotify:", error);
            navigate("/create-user");
        }
    };

    /**
     * Checks if the user exists in the database using their Spotify user ID.
     *
     * @param {string} spotifyUserId - The Spotify user ID.
     * @async
     */
    const checkUserExistsInDB = async (spotifyUserId) => {
        console.log("Checking user existence in DB for:", spotifyUserId);

        // Uncomment this section to check the user existence in the actual backend
        /*
        try {
            const response = await fetch(`/api/users/check-existence/${spotifyUserId}`);
            const data = await response.json();
            if (data.exists) {
                navigate("/dashboard"); // Redirect to dashboard if user exists
            } else {
                navigate("/create-user"); // Redirect to create user page if user does not exist
            }
        } catch (error) {
            console.error("Error checking user existence in DB:", error);
            navigate("/create-user"); // Redirect to create user page on error
        }
        */

        // Mocking user existence check for demonstration purposes
        const userExists = true; // Replace with actual check
        if (userExists) {
            navigate("/dashboard"); // Redirect to dashboard if user exists
        } else {
            navigate("/create-user"); // Redirect to create user page if user does not exist
        }
    };

    return <div>Loading...</div>; // Loading indicator while processing
};

export default SpotifyRedirect;