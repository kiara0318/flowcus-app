import {useEffect, useState} from "react";
import axios from "axios";

/**
 * Custom hook to fetch and manage the "Quote of the Day" data from an API.
 * Fetches the quote data once on mount and returns the quote, loading, and error states.
 *
 * @returns {Object} An object containing:
 * - `dailyQuote` ({quote: string, author: string} | null): The quote and author, or null if not fetched.
 * - `loading` (boolean): Whether the quote is currently being fetched.
 * - `error` (string | null): Error message if fetching fails, or null if there is no error.
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
                const response = await axios.get("http://localhost:3000/api/today");

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
