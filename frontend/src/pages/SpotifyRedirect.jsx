import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {LoadingIndicator} from "../components";

const SpotifyRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Current URL:", window.location.href);

        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken) {
            localStorage.setItem("spotifyAccessToken", accessToken);
            if (refreshToken) {
                localStorage.setItem("spotifyRefreshToken", refreshToken);
            }

            fetchUserInfo(accessToken).then();
        } else {
            console.error("Access token missing in URL.");
            alert("Access token is missing. Please log in again.");
            navigate("/login"); // Redirect to login page
        }

        // No cleanup necessary here
        return () => {
        };
    }, [navigate]);

    const fetchUserInfo = async (accessToken) => {
        try {
            const response = await fetch("https://api.spotify.com/v1/me", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                console.error("Failed to fetch user info, status:", response.status);
                const errorData = await response.json();
                console.error("Error details:", errorData);
                throw new Error("Failed to fetch user info");
            }

            const userInfo = await response.json();
            await checkUserExistsInDB(userInfo.id);
        } catch (error) {
            console.error("Error fetching user info from Spotify:", error);
            alert("Failed to fetch user info. Please try again.");
            navigate("/login"); // Redirect to login page
        }
    };

    const checkUserExistsInDB = async (spotifyUserId) => {
        console.log("Checking user existence in DB for:", spotifyUserId);
        const userExists = true; // Replace with actual check

        if (userExists) {
            navigate("/dashboard");
        } else {
            navigate("/create-user");
        }
    };

    return <LoadingIndicator/>;
};

export default SpotifyRedirect;
