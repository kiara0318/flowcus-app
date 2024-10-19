import React, {useCallback, useState} from "react";
import PropTypes from "prop-types";
import Picker from "emoji-picker-react";
import {Box, ClickAwayListener, IconButton} from "@mui/material";
import "./styles/EmojiPicker.css";

/**
 * EmojiPicker component allows users to select an emoji from a toggleable emoji picker.
 * Displays the selected emoji and calls an external callback on selection if provided.
 *
 * @param {Object} props - Component props.
 * @param {string} props.initialSkinTone - Initial skin tone setting for emojis (e.g., "neutral", "light").
 * @param {function} [props.onEmojiClick] - Optional callback function triggered when an emoji is selected.
 *
 * @returns {JSX.Element} The rendered EmojiPicker component.
 */
const EmojiPicker = ({initialSkinTone, onEmojiClick}) => {
    const defaultEmojiUrl = "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/2705.png";

    const [selectedEmoji, setSelectedEmoji] = useState({
        getImageUrl: () => defaultEmojiUrl
    });
    const [selectedSkinTone, setSelectedSkinTone] = useState(initialSkinTone);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleEmojiClick = useCallback((emojiObject) => {
        console.log(emojiObject);
        setSelectedEmoji(emojiObject);
        setShowEmojiPicker(false);
        if (onEmojiClick) onEmojiClick(emojiObject);
    }, [onEmojiClick]);

    const handleTogglePicker = () => setShowEmojiPicker((prev) => !prev);

    return (
        <div>
            <ClickAwayListener onClickAway={() => setShowEmojiPicker(false)}>
                <div className="emoji-picker-wrapper">
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
                    {showEmojiPicker && (
                        <Box className="emoji-picker" sx={{position: "absolute", zIndex: 1}}>
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
};

EmojiPicker.defaultProps = {
    initialSkinTone: "neutral",
};

export default EmojiPicker;






