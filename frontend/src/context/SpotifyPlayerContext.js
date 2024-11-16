import React, {createContext, useContext, useEffect, useRef, useState} from "react";
import PropTypes from "prop-types";
import {useAuth} from "./AuthContext";
import axios from "axios";
import EventEmitter from "events";

const trackEventEmitter = new EventEmitter();

export const SpotifyPlayerContext = createContext();

export const SpotifyPlayerProvider = ({children}) => {
    const {getValidAccessToken} = useAuth();
    const [player, setPlayer] = useState(null);
    const [deviceId, setDeviceId] = useState(null);
    const playerInitialized = useRef(false);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const initializePlayer = async () => {
            if (!window.Spotify) {
                console.error("Spotify SDK not loaded.");
                return;
            }

            const token = await getValidAccessToken();

            if (!token) {
                console.error("No valid access token found. Cannot initialize player.");
                return;
            }

            if (playerInitialized.current) {
                console.log("Spotify player is already initialized.");
                return;
            }

            try {
                const newPlayer = new window.Spotify.Player({
                    name: "Flowcus Spotify Player",
                    getOAuthToken: (cb) => cb(token),
                    volume: 0.5,
                    robustnessLevel: "SW_SECURE_DECODE",
                });

                newPlayer.addListener("ready", ({device_id}) => {
                    console.log("Player ready with Device ID:", device_id);
                    setDeviceId(device_id);
                });

                newPlayer.addListener("initialization_error", ({message}) => {
                    console.error("Initialization error:", message);
                });

                newPlayer.addListener("authentication_error", ({message}) => {
                    console.error("Authentication error:", message);
                });

                newPlayer.addListener("player_state_changed", (state) => {
                    if (state) {
                        const {position, paused, track_window} = state;
                        if (position === 0 && !paused) {
                            trackEventEmitter.emit("trackStarted", track_window.current_track);
                        } else if (track_window.previous_tracks.length > 0) {
                            trackEventEmitter.emit("trackEnded", track_window.current_track);
                        }

                        // Track paused state to use for task switching
                        setIsPaused(paused);
                    }
                });

                await newPlayer.connect();
                setPlayer(newPlayer);
                playerInitialized.current = true;
                console.log("Spotify player initialized successfully.");
            } catch (error) {
                console.error("Error initializing the player:", error);
            }
        };

        const timer = setTimeout(initializePlayer, 1000);

        return () => {
            clearTimeout(timer);
            if (player) {
                player.disconnect();
                setPlayer(null);
                playerInitialized.current = false;
            }
        };
    }, [getValidAccessToken]);

    const playTrack = async (uris) => {
        if (!deviceId) {
            console.error("Device ID is missing. Cannot play track.");
            return {success: false, error: "Device ID is missing."};
        }

        const token = await getValidAccessToken();
        if (!token) {
            console.error("No valid access token found for playback.");
            return {success: false, error: "No valid access token."};
        }

        try {
            const response = await axios.put(
                `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
                {uris: Array.isArray(uris) ? uris : [uris]},
                {headers: {Authorization: `Bearer ${token}`}}
            );
            console.log("Playback started");
            return {success: true, response};
        } catch (error) {
            console.error("Error starting playback:", error);
            return {success: false, error: error.response ? error.response.data : error.message};
        }
    };

    const pauseTrack = async () => {
        if (!deviceId) {
            console.error("Device ID is missing. Cannot pause playback.");
            return {success: false, error: "Device ID is missing."};
        }

        const token = await getValidAccessToken();
        if (!token) {
            console.error("No valid access token found for pausing.");
            return {success: false, error: "No valid access token."};
        }

        try {
            const response = await axios.put(
                `https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`,
                {},
                {headers: {Authorization: `Bearer ${token}`}}
            );
            console.log("Playback paused");
            return {success: true, response};
        } catch (error) {
            console.error("Error pausing playback:", error);
            return {success: false, error: error.response ? error.response.data : error.message};
        }
    };

    return (
        <SpotifyPlayerContext.Provider
            value={{player, playTrack, pauseTrack, trackEventEmitter, isSpotifyReady: !!deviceId, isPaused}}>
            {children}
        </SpotifyPlayerContext.Provider>
    );
};

SpotifyPlayerProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useSpotifyPlayer = () => useContext(SpotifyPlayerContext);

