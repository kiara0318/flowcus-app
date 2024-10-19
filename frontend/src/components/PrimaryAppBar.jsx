import React from "react";
import PropTypes from "prop-types";
import {AppBar, Box, IconButton, Menu, MenuItem, Toolbar} from "@mui/material";
import {AccountCircle} from "@mui/icons-material";
import logo from "./images/logo-no-bg.png";
import "./styles/PrimaryAppBar.css";

/**
 * PrimaryAppBar Component
 *
 * A component representing the primary application toolbar.
 * Includes a logo image on the left and a profile button that triggers a menu with profile options.
 *
 * @param {Object} props - The props for the component.
 * @param {Function} [props.onViewProfile] - Optional. Function to call when the "View Profile" menu item is clicked.
 * @param {Function} [props.onOpenSettings] - Optional. Function to call when the "Settings" menu item is clicked.
 * @param {Function} [props.onLogout] - Optional. Function to call when the "Logout" menu item is clicked.
 *
 * @returns {JSX.Element} The rendered PrimaryAppBar component.
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

// PropTypes validation
PrimaryAppBar.propTypes = {
    onViewProfile: PropTypes.func,
    onOpenSettings: PropTypes.func,
    onLogout: PropTypes.func,
};

export default PrimaryAppBar;
