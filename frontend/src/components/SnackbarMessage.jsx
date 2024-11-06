import React from "react";
import {Snackbar} from "@mui/material";
import PropTypes from "prop-types";

/**
 * SnackbarMessage component displays a temporary message to the user.
 *
 * @param {Object} props - Component properties.
 * @param {boolean} props.open - Indicates whether the Snackbar is open.
 * @param {string} props.message - The message to display in the Snackbar.
 * @param {function} props.onClose - Callback function to call when the Snackbar is closed.
 * @returns {JSX.Element} Rendered Snackbar component displaying the message.
 */
const SnackbarMessage = ({open, message, onClose}) => (
    <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={onClose}
        message={message}
    />
);

SnackbarMessage.propTypes = {
    open: PropTypes.bool,
    message: PropTypes.string,
    onClose: PropTypes.func,
};

export default SnackbarMessage;

