import React from "react";
import {CircularProgress} from "@mui/material";

/**
 * LoadingIndicator component displays a circular progress spinner to indicate loading status.
 *
 * @returns {JSX.Element} Rendered LoadingIndicator component.
 */
const LoadingIndicator = () => (
    <CircularProgress className="loading-spinner"/>
);

export default LoadingIndicator;

