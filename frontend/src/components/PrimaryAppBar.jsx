import React from "react";
import PropTypes from "prop-types";
import {AppBar, Box, IconButton, Menu, MenuItem, Toolbar} from "@mui/material";
import {AccountCircle} from "@mui/icons-material";
import logo from "./images/logos/flowcus-bubble.png";
import "./styles/PrimaryAppBar.css";

/**
 * PrimaryAppBar component serves as the main navigation bar for the application.
 *
 * @param {Object} props - Component properties.
 * @param {Function} [props.onViewProfile] - Callback function triggered when the "View Profile" menu item is clicked.
 * @param {Function} [props.onOpenSettings] - Callback function triggered when the "Settings" menu item is clicked.
 * @param {Function} [props.onLogout] - Callback function triggered when the "Logout" menu item is clicked.
 * @returns {JSX.Element} Rendered PrimaryAppBar component.
 */
const PrimaryAppBar = ({onViewProfile, onOpenSettings, onLogout}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);

    const handleMenuClose = () => setAnchorEl(null);

    const handleMenuItemClick = (callback) => {
        handleMenuClose();
        if (callback) callback();
    };

    return (
        <AppBar position="sticky" className="app-bar">
            <Toolbar>
                <img src={logo} alt="Logo" className="logo"/>
                <Box sx={{flexGrow: 1}}/>
                <IconButton edge="end" onClick={handleMenuOpen}>
                    <AccountCircle className="icon-button"/>
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                    <MenuItem onClick={() => handleMenuItemClick(onViewProfile)}>View Profile</MenuItem>
                    <MenuItem onClick={() => handleMenuItemClick(onOpenSettings)}>Settings</MenuItem>
                    <MenuItem onClick={() => handleMenuItemClick(onLogout)}>Logout</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

PrimaryAppBar.propTypes = {
    onViewProfile: PropTypes.func,
    onOpenSettings: PropTypes.func,
    onLogout: PropTypes.func,
};

export default PrimaryAppBar;
