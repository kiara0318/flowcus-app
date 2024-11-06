import React from "react";
import {Typography} from "@mui/material";
import PropTypes from "prop-types";

/**
 * ErrorMessage component displays an error message in a styled Typography component.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.message - The error message to display.
 * @returns {JSX.Element} Rendered ErrorMessage component.
 */
const ErrorMessage = ({message}) => (
    <Typography variant="h6" className="error-message" color="error">
        {message}
    </Typography>
);

ErrorMessage.propTypes = {
    message: PropTypes.string.isRequired,
};

export default ErrorMessage;
