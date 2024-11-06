import React, {useEffect, useState} from "react";
import {useDailyQuote} from "../utils/hooks";
import "./Dashboard.css";
import {ErrorMessage, LoadingIndicator, Marquee, PrimaryAppBar, QuoteDisplay, TaskList} from "../components";
import {Box} from "@mui/material";

/**
 * Dashboard component that displays the daily quote, a task list, and a marquee showing the currently playing track.
 * Manages track transitions and fade animations for the marquee.
 *
 * @component
 * @returns {JSX.Element} The rendered Dashboard component.
 */
const Dashboard = () => {
    const {dailyQuote, loading: quoteLoading, error} = useDailyQuote();
    const [currentTrack, setCurrentTrack] = useState(null);
    const [fadeOut, setFadeOut] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);

    /**
     * Renders the content for the daily quote section.
     * Displays a loading indicator, error message, or the quote itself based on the state.
     *
     * @returns {JSX.Element} The content to render for the daily quote section.
     */
    const renderContent = () => {
        if (quoteLoading) {
            return <LoadingIndicator/>;
        }
        if (error) {
            return <ErrorMessage message={error.message}/>;
        }
        return dailyQuote ? (
            <QuoteDisplay dailyQuote={dailyQuote}/>
        ) : (
            <ErrorMessage message="No quote available."/>
        );
    };

    /**
     * Effect hook that triggers when `currentTrack` changes.
     * Manages the fade-in and fade-out animations for the marquee.
     */
    useEffect(() => {
        if (currentTrack) {
            setTimeout(() => setFadeIn(true), 100); // Delays the fade-in effect slightly
            setFadeOut(false);
        }
    }, [currentTrack]);

    /**
     * Handles the end of the marquee animation.
     * Resets the `currentTrack` and fade states when the fade-out animation completes.
     */
    const handleMarqueeAnimationEnd = () => {
        if (fadeOut) {
            setCurrentTrack(null);
            setFadeOut(false);
            setFadeIn(false);
        }
    };

    return (
        <Box className="dashboard-container">
            <PrimaryAppBar/>
            <Box className="quote-container">{renderContent()}</Box>
            <Box className="dashboard-content">
                <Box className="left-side">
                    <div className="dashboard-task-container">
                        <TaskList
                            setCurrentPlayingTrack={setCurrentTrack}
                            fadeOut={fadeOut}
                            setFadeIn={setFadeIn}
                            setFadeOut={setFadeOut}
                        />
                    </div>
                </Box>
                <Box className="right-side">
                    {/* Additional components can be added here if needed */}
                </Box>
            </Box>
            {currentTrack && (
                <Marquee
                    text={`Now Playing: ${currentTrack.name} by ${currentTrack.artistsDisplayName}`}
                    onAnimationEnd={handleMarqueeAnimationEnd}
                    className={`marquee ${fadeIn ? "fade-in" : ""} ${fadeOut ? "fade-out" : ""}`}
                />
            )}
        </Box>
    );
};

export default Dashboard;

