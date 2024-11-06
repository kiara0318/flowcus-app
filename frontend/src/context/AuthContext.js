import React, {createContext, useContext, useEffect, useRef, useState} from "react";
import axios from "axios";
import PropTypes from "prop-types";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [accessToken, setAccessToken] = useState(() => localStorage.getItem("spotifyAccessToken"));
    const initialized = useRef(false); // To track if initialization has been done

    const refreshAccessToken = async () => {
        const refreshToken = localStorage.getItem("spotifyRefreshToken");
        if (!refreshToken) {
            console.warn("No refresh token available, cannot refresh access token");
            return null;
        }

        try {
            const {data} = await axios.post(`${process.env.REACT_APP_API_URL}/refresh_token`, {refreshToken});
            const {accessToken: newAccessToken} = data;

            // Update access token and expiry in local storage
            localStorage.setItem("spotifyAccessToken", newAccessToken);
            localStorage.setItem("spotifyAccessTokenExpiry", Date.now() + 3600 * 1000); // 1 hour expiry

            return newAccessToken;
        } catch (error) {
            console.error("Failed to refresh access token:", error);
            // Clear tokens on failure
            localStorage.removeItem("spotifyAccessToken");
            localStorage.removeItem("spotifyRefreshToken");
            setAccessToken(null); // Set state to null if refresh fails
            return null;
        }
    };

    const getValidAccessToken = async () => {
        const tokenExpiry = localStorage.getItem("spotifyAccessTokenExpiry");
        if (!tokenExpiry || Date.now() >= tokenExpiry) {
            return await refreshAccessToken(); // Refresh if expired
        }
        return accessToken; // Token is still valid
    };

    useEffect(() => {
        // Only run once, initialize token if not already done
        if (initialized.current) return;
        initialized.current = true;

        const initializeToken = async () => {
            const token = await getValidAccessToken();
            if (token) {
                setAccessToken(token); // Set the token only if we have a valid one
            }
        };

        initializeToken();
    }, []); // Empty dependency array ensures it only runs once

    return (
        <AuthContext.Provider value={{accessToken, getValidAccessToken}}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
