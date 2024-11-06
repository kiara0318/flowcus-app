import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import PropTypes from "prop-types";
import "./styles/TrackSelector.css";
import {useAuth} from "../context";
import {TextField} from "@mui/material";
import {formatArtists} from "../utils";
import LoadingIndicator from "./LoadingIndicator";

/**
 * TrackSelector component allows users to search for and select tracks from Spotify.
 * @param {Object} props - The props for the TrackSelector component.
 * @param {Function} props.onTrackSelect - Callback function to handle track selection.
 * @returns {JSX.Element} The rendered TrackSelector component.
 */
const TrackSelector = ({onTrackSelect}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [tracks, setTracks] = useState([]);
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [offset, setOffset] = useState(0);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const trackListRef = useRef(null);
    const uniqueTrackIds = useRef(new Set());
    const {getValidAccessToken} = useAuth();
    const debounceTimeout = useRef(null);

    useEffect(() => {
        if (searchQuery.trim()) {
            clearTimeout(debounceTimeout.current);
            debounceTimeout.current = setTimeout(() => {
                uniqueTrackIds.current.clear();
                setTracks([]);
                setOffset(0);
                searchTracks(searchQuery);
            }, 500);
        } else {
            setTracks([]);
        }

        return () => clearTimeout(debounceTimeout.current);
    }, [searchQuery]);

    /**
     * Searches for tracks using the Spotify API based on the query.
     * @param {string} query - The search query for tracks.
     * @param {number} offset - The offset for paginated results.
     */
    const searchTracks = async (query, offset = 0) => {
        const token = await getValidAccessToken();
        if (!token || !query.trim()) return;

        setIsLoading(true); // Set loading to true

        try {
            const response = await axios.get("https://api.spotify.com/v1/search", {
                headers: {Authorization: `Bearer ${token}`},
                params: {q: query, type: "track", limit: 10, offset},
            });

            if (response.data.tracks.total === 0) return;

            const newTracks = response.data.tracks.items.filter((track) => {
                if (uniqueTrackIds.current.has(track.id)) return false;
                uniqueTrackIds.current.add(track.id);
                return true;
            });

            if (newTracks.length > 0) {
                setError(null); // Clear the error if new tracks are found
            }

            setTracks((prevTracks) => [...prevTracks, ...newTracks]);
            setOffset((prevOffset) => prevOffset + newTracks.length);
        } catch (error) {
            console.error("Error searching tracks:", error);
            setError("Failed to load tracks. Please try again.");
        } finally {
            setIsLoading(false); // Set loading to false
        }
    };

    /**
     * Clears the current search query and resets the track list.
     */
    const clearSearch = () => {
        setSearchQuery("");
        setTracks([]);
        setOffset(0);
        uniqueTrackIds.current.clear();
        setError(null);
    };

    /**
     * Clears the currently selected track.
     */
    const clearSelectedTrack = () => {
        setSelectedTrack(null);
        onTrackSelect(null);
    };

    /**
     * Handles track selection and invokes the onTrackSelect callback.
     * @param {Object} track - The selected track object.
     */
    const handleTrackSelect = (track) => {
        console.log(track);
        setSelectedTrack(track);
        onTrackSelect(track);
        clearSearch();
    };

    /**
     * Handles scrolling for infinite track loading.
     */
    const handleScroll = () => {
        if (trackListRef.current) {
            const {scrollTop, scrollHeight, clientHeight} = trackListRef.current;
            if (scrollTop + clientHeight >= scrollHeight - 5 && searchQuery) {
                searchTracks(searchQuery, offset);
            }
        }
    };

    useEffect(() => {
        const trackListEl = trackListRef.current;
        if (trackListEl) trackListEl.addEventListener("scroll", handleScroll);

        return () => {
            if (trackListEl) trackListEl.removeEventListener("scroll", handleScroll);
        };
    }, [searchQuery, offset]);

    return (
        <div className="track-selector">
            {isLoading && <LoadingIndicator/>}
            <TextField
                autoFocus
                margin="dense"
                id="searchInput"
                type="text"
                fullWidth
                variant="outlined"
                sx={{backgroundColor: "white"}}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a track..."
                className="search-input"
            />
            {selectedTrack && (
                <div className="selected-track">
                    {selectedTrack.album.images[2]?.url && (
                        <img
                            src={selectedTrack.album.images[2].url}
                            alt={selectedTrack.name}
                            className="track-image"
                        />
                    )}
                    <div className="track-info">
                        <div className="track-name">{selectedTrack.name}</div>
                        <div className="track-artists">{formatArtists(selectedTrack.artists)}</div>
                    </div>
                    <button className="clear-button" onClick={clearSelectedTrack}>
                        &times;
                    </button>
                </div>
            )}
            {error && <div className="error-message">{error}</div>}
            {tracks.length > 0 && (
                <div className="track-list" ref={trackListRef}>
                    {tracks.map((track) => (
                        <div key={track.id} className="track-item" onClick={() => handleTrackSelect(track)}>
                            {track.album.images[2]?.url && (
                                <img
                                    src={track.album.images[2].url}
                                    alt={track.name}
                                    className="track-image"
                                />
                            )}
                            <div className="track-info">
                                <div className="track-name">{track.name}</div>
                                <div className="track-artists">{formatArtists(track.artists)}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

TrackSelector.propTypes = {
    onTrackSelect: PropTypes.func.isRequired,
};

export default TrackSelector;
