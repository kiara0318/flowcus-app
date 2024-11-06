import React, {useCallback, useState} from "react";
import PropTypes from "prop-types";
import Picker from "emoji-picker-react";
import {Box, ClickAwayListener, IconButton, Tooltip} from "@mui/material";
import "./styles/EmojiPicker.css";

/**
 * EmojiPicker component allows users to select an emoji and notifies a parent component when an emoji is chosen.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.defaultEmoji - The default emoji to display.
 * @param {string} [props.initialSkinTone="neutral"] - The initial skin tone for the emoji picker.
 * @param {Function} [props.onEmojiClick] - Callback function triggered when an emoji is clicked.
 * @returns {JSX.Element} Rendered EmojiPicker component.
 */
const EmojiPicker = ({
                         defaultEmoji,
                         initialSkinTone = "neutral",
                         onEmojiClick
                     }) => {
    const [selectedEmoji, setSelectedEmoji] = useState(defaultEmoji);
    const [selectedSkinTone, setSelectedSkinTone] = useState(initialSkinTone);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    /**
     * Handles the event when an emoji is clicked.
     *
     * @param {Object} emojiObject - The clicked emoji object.
     */
    const handleEmojiClick = useCallback((emojiObject) => {
        console.log(emojiObject);
        setSelectedEmoji(emojiObject);
        setShowEmojiPicker(false);
        if (onEmojiClick) onEmojiClick(emojiObject);
    }, [onEmojiClick]);

    /**
     * Toggles the visibility of the emoji picker.
     */
    const handleTogglePicker = () => setShowEmojiPicker((prev) => !prev);

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
                                onSkinToneChange={setSelectedSkinTone}
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
    initialSkinTone: PropTypes.oneOf(["neutral", "light", "medium-light", "medium", "medium-dark", "dark"]),
    onEmojiClick: PropTypes.func,
    defaultEmoji: PropTypes.object.isRequired
};

export default EmojiPicker;