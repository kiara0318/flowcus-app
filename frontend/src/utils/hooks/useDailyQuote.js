import {useEffect, useState} from "react";
import axios from "axios";

/**
 * useDailyQuote custom hook fetches and manages the "Quote of the Day" data from an API.
 *
 * It fetches the quote data once on mount and returns the quote, loading state, and any error encountered.
 *
 * @returns {Object} An object containing:
 * - {Object | null} dailyQuote - The daily quote and author, or null if not fetched.
 *   - {string} dailyQuote.quote - The quote text.
 *   - {string} dailyQuote.author - The author of the quote.
 * - {boolean} loading - Indicates whether the quote is currently being fetched.
 * - {string | null} error - Error message if fetching fails, or null if there is no error.
 */
const useDailyQuote = () => {
    const [dailyQuote, setDailyQuote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDailyQuote = async () => {
            setLoading(true);
            setError(null); // Reset error state on new fetch
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/today`);

                // Check for expected data format
                const {quote, author} = response.data;

                if (quote && author) {
                    setDailyQuote({quote, author});
                } else {
                    throw new Error("Invalid quote format");
                }
            } catch (err) {
                console.error("Error fetching daily quote:", err);
                setError(err.response?.data?.error || err.message || "Failed to fetch quote");
            } finally {
                setLoading(false);
            }
        };

        fetchDailyQuote();
    }, []);

    return {dailyQuote, loading, error};
};

export default useDailyQuote;
