require("dotenv").config();
const express = require("express");
const {Pool} = require("pg");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = process.env.PORT;

// PostgreSQL connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Middleware setup
app.use(cors());
app.use(express.json());

// Connect to the database and log the status
pool.connect((err) => {
    if (err) {
        console.error("Error connecting to the database", err);
    } else {
        console.log("Connected to the database");
    }
});

// Define redirect URIs and Spotify configuration
const redirectUriBackend = "http://localhost:3000/callback";
const redirectUriFrontend = "http://localhost:3001/callback";
const spotifyTokenUrl = "https://accounts.spotify.com/api/token";
const spotifyClientId = process.env.SPOTIFY_CLIENT_ID;
const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET;

// Scopes for Spotify API authorization
const spotifyAuthScope = [
    "user-read-private",
    "user-read-email",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    "streaming"
].join(" ");

/**
 * Initiates the Spotify login process by redirecting the user
 * to the Spotify authorization page.
 *
 * @route GET /login
 */
app.get("/login", (req, res) => {
    const spotifyAuthUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${spotifyClientId}&scope=${encodeURIComponent(spotifyAuthScope)}&redirect_uri=${encodeURIComponent(redirectUriBackend)}`;
    res.redirect(spotifyAuthUrl);
});

/**
 * Handles the Spotify OAuth callback, retrieves the access token,
 * and redirects to the frontend with the access token.
 *
 * @route GET /callback
 * @async
 */
app.get("/callback", async (req, res) => {
    const code = req.query.code;
    if (!code) {
        console.error("Authorization code not provided");
        return res.status(400).send("Authorization code not provided");
    }

    try {
        const response = await axios.post(
            spotifyTokenUrl,
            new URLSearchParams({
                grant_type: "authorization_code",
                code: code,
                redirect_uri: redirectUriBackend,
                client_id: spotifyClientId,
                client_secret: spotifyClientSecret,
            }),
            {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
            }
        );

        const {access_token, refresh_token} = response.data;
        console.log("Access token retrieved");

        // Redirect to frontend callback with access token
        res.redirect(`${redirectUriFrontend}?access_token=${access_token}&refresh_token=${refresh_token}`);
    } catch (error) {
        console.error("Error fetching Spotify tokens:", error.response ? error.response.data : error.message);
        return res.status(500).send("Authentication failed");
    }
});

app.post("/refresh_token", async (req, res) => {
    const {refreshToken} = req.body;

    if (!refreshToken) {
        return res.status(400).json({error: "Refresh token is required"});
    }

    try {
        console.log("Attempting to refresh token with:", refreshToken); // Log the refresh token

        const response = await axios.post("https://accounts.spotify.com/api/token", null, {
            params: {
                grant_type: "refresh_token",
                refresh_token: refreshToken,
                client_id: spotifyClientId,
                client_secret: spotifyClientSecret,
            },
        });

        const {access_token} = response.data;
        console.log("Access token refreshed:", access_token); // Log the new access token

        res.json({accessToken: access_token});
    } catch (error) {
        console.error("Error refreshing access token:", error.response ? error.response.data : error.message);
        if (error.response && error.response.data) {
            // Handle specific error messages
            if (error.response.data.error === "invalid_grant") {
                return res.status(400).json({
                    error: "Invalid refresh token. Please re-authenticate."
                });
            }
        }
        res.status(500).json({
            error: "Failed to refresh access token",
            details: error.response ? error.response.data : error.message
        });
    }
});

/**
 * Fetches a daily quote from the ZenQuotes API.
 * Only fetches a new quote if the date has changed.
 *
 * @route GET /api/today
 * @async
 */
let lastFetchDate = null; // Variable to store the last fetch date
let dailyQuote = null; // Cache for the daily quote

app.get("/api/today", async (req, res) => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    // Check if the quote has already been fetched today
    if (lastFetchDate === today && dailyQuote) {
        return res.json(dailyQuote); // Return cached quote
    }

    try {
        // Fetch today's quote from the external API
        const response = await axios.get("https://zenquotes.io/api/today");
        const quoteData = response.data;

        // Validate the quote data and construct the response
        if (Array.isArray(quoteData) && quoteData.length > 0) {
            dailyQuote = {
                quote: quoteData[0].q,
                author: quoteData[0].a,
            };
            lastFetchDate = today; // Update the last fetch date
            return res.json(dailyQuote); // Send the daily quote as a response
        } else {
            return res.status(404).json({error: "No quote found"});
        }
    } catch (error) {
        console.error("Error fetching quote:", error);
        return res.status(500).json({error: "Failed to fetch quote"});
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});