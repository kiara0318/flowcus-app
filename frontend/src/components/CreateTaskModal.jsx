import * as React from "react";
import Button from "@mui/material/Button";
import {Alert, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField} from "@mui/material";
import {EmojiPicker, TrackSelector} from "./index";
import "./styles/CreateTaskModal.css";
import PropTypes from "prop-types";
import {AddCircle} from "@mui/icons-material";

/**
 * CreateTaskModal component allows users to create a new task with an emoji, a name, and a track selection.
 *
 * @param {Object} props - Component properties.
 * @param {Function} props.onCreateTask - Callback function to handle task creation.
 * @returns {JSX.Element} Rendered CreateTaskModal component.
 */
const CreateTaskModal = ({onCreateTask}) => {
    const defaultEmojiUrl = "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/2705.png";
    const defaultEmoji = {
        getImageUrl: () => defaultEmojiUrl,
        emoji: "✅",
    };

    const [open, setOpen] = React.useState(false);
    const [emoji, setEmoji] = React.useState(defaultEmoji);
    const [selectedTrack, setSelectedTrack] = React.useState(null);
    const [taskName, setTaskName] = React.useState("");
    const [error, setError] = React.useState("");

    const isFormComplete = emoji && selectedTrack && taskName;

    /**
     * Opens the dialog for creating a new task.
     */
    const handleClickOpen = () => {
        setOpen(true);
    };

    /**
     * Closes the dialog and resets the form fields.
     */
    const handleClose = () => {
        setOpen(false);
        setSelectedTrack(null);
        setTaskName("");
        setEmoji(defaultEmoji);
        setError("");
    };

    /**
     * Handles the emoji selection from the EmojiPicker.
     *
     * @param {Object} emojiObject - Selected emoji object.
     */
    const handleEmojiPick = (emojiObject) => {
        setEmoji(emojiObject);
    };

    /**
     * Handles track selection from the TrackSelector.
     *
     * @param {Object} track - Selected track object.
     */
    const handleTrackSelect = (track) => {
        setSelectedTrack(track);
        setError(""); // Clear error when a track is selected
    };

    /**
     * Handles form submission for creating a new task.
     *
     * @param {Event} event - The form submit event.
     */
    const handleSubmit = (event) => {
        event.preventDefault();

        if (!selectedTrack) {
            setError("Please select a track before submitting.");
            return;
        }

        onCreateTask(taskName, emoji, selectedTrack);
        handleClose();
    };

    return (
        <React.Fragment>
            <IconButton onClick={handleClickOpen}>
                <AddCircle/>
            </IconButton>
            <Dialog className="dialog" open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle className="dialog-title">Create New Task</DialogTitle>
                <DialogContent className="dialog-content">
                    <div className="emoji-picker-container">
                        <EmojiPicker onEmojiClick={handleEmojiPick} defaultEmoji={emoji}/>
                    </div>
                    {error && <Alert severity="error" className="error-alert">{error}</Alert>}
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="taskName"
                        label="Task Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        className="task-name-input"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                    />
                    <TrackSelector onTrackSelect={handleTrackSelect}/>
                </DialogContent>
                <DialogActions className="dialog-actions">
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={!isFormComplete}>Submit</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

CreateTaskModal.propTypes = {
    onCreateTask: PropTypes.func.isRequired,
};

export default CreateTaskModal;
