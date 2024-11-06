import React from "react";
import PropTypes from "prop-types";
import {Box, Card, Chip, IconButton, Typography} from "@mui/material";
import {PlayCircle, StopCircle} from "@mui/icons-material";
import "./styles/TaskCard.css";

/**
 * SoundBars component represents a visual indicator for sound activity.
 *
 * @returns {JSX.Element} Rendered sound bars.
 */
const SoundBars = () => (
    <div className="sound-bars">
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
    </div>
);

/**
 * TaskActionButton component renders a play or stop button for a task.
 *
 * @param {Object} props - Component properties.
 * @param {boolean} props.isPlaying - Indicates whether the task is currently playing.
 * @param {function} props.onClick - Callback function for button click.
 * @param {boolean} props.isCompleted - Indicates if the task is completed.
 * @param {boolean} [props.isDisabled] - Optional flag to disable the button.
 * @returns {JSX.Element} Rendered action button for the task.
 */
const TaskActionButton = ({isPlaying, onClick, isCompleted, isDisabled}) => (
    <IconButton
        color={isPlaying ? "secondary" : "primary"}
        onClick={onClick}
        className="task-button"
        disabled={isCompleted || isDisabled}
    >
        {isPlaying ? <StopCircle/> : <PlayCircle/>}
    </IconButton>
);

TaskActionButton.propTypes = {
    isPlaying: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    isCompleted: PropTypes.bool.isRequired,
    isDisabled: PropTypes.bool,
};

/**
 * Format a duration in milliseconds to a string "minutes:seconds".
 *
 * @param {number} duration - Duration in milliseconds.
 * @returns {string} Formatted duration string.
 */
const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

/**
 * TaskCard component displays information about a task including its status and actions.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.task - Task details.
 * @param {function} props.onClick - Callback function for the action button.
 * @param {boolean} props.isPlaying - Indicates if the task is currently playing.
 * @param {boolean} props.isCompleted - Indicates if the task is completed.
 * @param {boolean} [props.isDisabled] - Optional flag to disable the action button.
 * @param {number} [props.remainingDuration] - Remaining duration of the task in milliseconds.
 * @returns {JSX.Element} Rendered task card component.
 */
const TaskCard = ({task, onClick, isPlaying, isCompleted, isDisabled, remainingDuration}) => {
    return (
        <div className={`task-card ${isCompleted ? "completed" : ""}`}>
            <Card className={`task-card ${isPlaying ? "task-card-playing" : ""}`}>
                <Box className="task-card-content">
                    <Typography variant="h5" className="task-emoji">
                        {task.emoji}
                    </Typography>
                    <Typography variant="body1" className="task-name">
                        {task.taskName}
                    </Typography>
                    {isPlaying && remainingDuration > 0 && (
                        <Typography className="remaining-duration">
                            {formatDuration(remainingDuration)}
                        </Typography>
                    )}
                    {isPlaying && <SoundBars/>}
                    {isCompleted ? (
                        <Chip label="Done" color="success"/>
                    ) : (
                        <TaskActionButton
                            isPlaying={isPlaying}
                            onClick={onClick}
                            isCompleted={isCompleted}
                            isDisabled={isDisabled}
                        />
                    )}
                </Box>
            </Card>
        </div>
    );
};

TaskCard.propTypes = {
    task: PropTypes.exact({
        id: PropTypes.string.isRequired,
        taskName: PropTypes.string.isRequired,
        emoji: PropTypes.string,
        track: PropTypes.exact({
            name: PropTypes.string.isRequired,
            uri: PropTypes.string.isRequired,
            duration_ms: PropTypes.number.isRequired,
            artistsDisplayName: PropTypes.string.isRequired,
            image: PropTypes.string.isRequired,
        }).isRequired,
        isCompleted: PropTypes.bool.isRequired,
    }).isRequired,
    onClick: PropTypes.func.isRequired,
    isPlaying: PropTypes.bool.isRequired,
    isCompleted: PropTypes.bool.isRequired,
    isDisabled: PropTypes.bool,
    remainingDuration: PropTypes.number,
};

export default TaskCard;