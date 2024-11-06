import {useEffect, useState} from "react";

/**
 * Custom hook to manage a Snackbar with queued messages.
 *
 * @returns {Object} An object containing:
 * - snackbarOpen: {boolean} - Controls the Snackbar visibility.
 * - snackbarMessage: {string} - The current message to display in the Snackbar.
 * - showSnackbar: {function} - Adds a new message to the Snackbar queue.
 * - setSnackbarOpen: {function} - Manually controls the Snackbar's open state.
 */
const useSnackbar = () => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [messageQueue, setMessageQueue] = useState([]);

    /**
     * Adds a new message to the Snackbar queue and closes the Snackbar if already open.
     *
     * @param {string} message - The message to display in the Snackbar.
     */
    const showSnackbar = (message) => {
        setMessageQueue((prevQueue) => [...prevQueue, message]);

        // Close the Snackbar if it's already open
        if (snackbarOpen) {
            setSnackbarOpen(false);
        }
    };

    /**
     * Effect hook to display messages from the queue in the Snackbar.
     * Waits for the Snackbar to close before showing the next message in the queue.
     */
    useEffect(() => {
        const displayNextMessage = () => {
            if (messageQueue.length > 0) {
                const nextMessage = messageQueue[0];
                setSnackbarMessage(nextMessage);
                setSnackbarOpen(true);
                // Remove the displayed message from the queue
                setMessageQueue((prevQueue) => prevQueue.slice(1));
            }
        };

        if (!snackbarOpen) {
            const delayTimeout = setTimeout(displayNextMessage, 100);
            return () => clearTimeout(delayTimeout);
        }
    }, [snackbarOpen, messageQueue]);

    return {snackbarOpen, snackbarMessage, showSnackbar, setSnackbarOpen};
};

export default useSnackbar;