import React, {useCallback, useEffect, useState} from "react";
import PropTypes from "prop-types";
import Picker from "emoji-picker-react";
import {Box, ClickAwayListener, IconButton, Tooltip} from "@mui/material";
import "./styles/EmojiPicker.css";

// Mapping human-readable skin tone names to codes
const skinToneMap = {
    neutral: "neutral",
    light: "1f3fb",
    "medium-light": "1f3fc",
    medium: "1f3fd",
    "medium-dark": "1f3fe",
    dark: "1f3ff"
};

const EmojiPicker = ({
                         defaultEmoji,
                         initialSkinTone = "neutral",
                         onEmojiClick
                     }) => {
    const [selectedEmoji, setSelectedEmoji] = useState(defaultEmoji);
    const [selectedSkinTone, setSelectedSkinTone] = useState(skinToneMap[initialSkinTone]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    // Sync selectedSkinTone whenever initialSkinTone changes
    useEffect(() => {
        setSelectedSkinTone(skinToneMap[initialSkinTone]);
    }, [initialSkinTone]);

    const handleEmojiClick = useCallback((emojiObject) => {
        setSelectedEmoji(emojiObject);
        setShowEmojiPicker(false);
        if (onEmojiClick) onEmojiClick(emojiObject);
    }, [onEmojiClick]);

    const handleSkinToneChange = (skinTone) => {
        setSelectedSkinTone(skinTone);
    };

    const handleTogglePicker = () => setShowEmojiPicker(prev => !prev);

    return (
        <div>
            <ClickAwayListener onClickAway={() => setShowEmojiPicker(false)}>
                <div className="emoji-picker-wrapper">
                    <Tooltip title="Select emoji">
                        <IconButton
                            className="emoji-button"
                            onClick={handleTogglePicker}
                            aria-label="Select emoji"
                            aria-haspopup="true"
                            aria-expanded={showEmojiPicker}
                            disableFocusRipple
                        >
                            <img src={selectedEmoji.getImageUrl()} alt="selected-emoji"/>
                        </IconButton>
                    </Tooltip>
                    {showEmojiPicker && (
                        <Box className="emoji-picker">
                            <Picker
                                onEmojiClick={handleEmojiClick}
                                defaultSkinTone={selectedSkinTone}
                                onSkinToneChange={handleSkinToneChange}
                                previewConfig={{showPreview: false}}
                            />
                        </Box>
                    )}
                </div>
            </ClickAwayListener>
        </div>
    );
};

EmojiPicker.propTypes = {
    initialSkinTone: PropTypes.oneOf([
        "neutral", "light", "medium-light", "medium", "medium-dark", "dark"
    ]),
    onEmojiClick: PropTypes.func,
    defaultEmoji: PropTypes.object.isRequired
};

export default EmojiPicker;
