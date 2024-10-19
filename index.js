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

        const {access_token} = response.data;
        console.log("Access token retrieved:", access_token);

        // Redirect to frontend callback with access token
        res.redirect(`${redirectUriFrontend}?access_token=${access_token}`);
    } catch (error) {
        console.error("Error fetching Spotify tokens:", error.response ? error.response.data : error.message);
        return res.status(500).send("Authentication failed");
    }
});

/**
 * Fetches a daily quote from the ZenQuotes API.
 * Only fetches a new quote if the date has changed.
 *
 * @route GET /api/today
 * @async
 */
// Example: Resetting lastFetchDate to allow fetching quote every time
let lastFetchDate = null; // Variable to store the last fetch date

app.get("/api/today", async (req, res) => {
    let dailyQuote = null;
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    // This logic allows fetching the quote even if it was fetched today
    lastFetchDate = null; // Reset for testing or remove this line for normal operation

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
        } else {
            return res.status(404).json({error: "No quote found"});
        }
    } catch (error) {
        console.error("Error fetching quote:", error);
        return res.status(500).json({error: "Failed to fetch quote"});
    }

    res.json(dailyQuote); // Send the daily quote as a response
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
