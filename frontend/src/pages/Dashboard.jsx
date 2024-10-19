import React from "react";
import {Box, CircularProgress, Typography} from "@mui/material";
import {PrimaryAppBar} from "../components";
import useDailyQuote from "../hooks/useDailyQuote";
import QuoteCard from "../components/QuoteCard";
import "./Dashboard.css"; // Import the CSS file for styling

/**
 * Dashboard component that displays the Quote of the Day.
 * Uses a custom hook to fetch quotes and displays them in stylized cards.
 */
const Dashboard = () => {
    const {dailyQuote, loading, error} = useDailyQuote(); // Use the updated custom hook

    /**
     * Renders the content based on the loading and error states.
     * @returns {JSX.Element} The content to be displayed in the dashboard.
     */
    const renderContent = () => {
        if (loading) {
            return <CircularProgress color="inherit"/>; // Show loading spinner while fetching data
        }

        if (error) {
            return (
                <Typography variant="h6" color="error">
                    {error.message || "An error occurred while fetching the quote."}
                </Typography>
            ); // Display error message if fetching fails
        }

        // Check if dailyQuote is available
        if (!dailyQuote) {
            return <Typography variant="h6">No quote available.</Typography>; // Fallback message
        }

        // Destructure quote and author directly from dailyQuote
        const {author, quote} = dailyQuote;

        return (
            <QuoteCard
                quote={quote || "Quote not found."} // Fallback for missing quote
                author={author || "Unknown"} // Fallback for missing author
            />
        );
    };

    return (
        <Box sx={{height: "100vh", position: "relative", overflow: "hidden"}}>
            <Box className="dashboard-overlay"/>
            <PrimaryAppBar/>
            <Box className="dashboard-content">
                {renderContent()} {/* Render Quotes */}
                {/*<WebPlayback/>*/}
            </Box>
        </Box>
    );
};

export default Dashboard;

