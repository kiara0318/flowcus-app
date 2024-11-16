import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {AppBar, Box, Toolbar, Typography} from "@mui/material";
import "./styles/TaskList.css";
import {CreateTaskModal, SnackbarMessage, TaskCard} from "./index";
import {useSnackbar} from "../utils/hooks";
import {Inbox} from "@mui/icons-material";
import {useSpotifyPlayer} from "../context";
import {v4 as uuidv4} from "uuid";
import {formatArtists} from "../utils";

/**
 * AppBar component for the Task List.
 * @param {Object} props
 * @param {Function} props.onCreateTask - Function to handle task creation.
 * @returns {JSX.Element} The rendered AppBar component.
 */
const TaskAppBar = ({onCreateTask}) => (
    <AppBar position="sticky" className="task-appbar">
        <Toolbar variant="dense" className="toolbar">
            <Typography variant="h6" color="inherit">
                Tasks
            </Typography>
            <div className="toolbar-buttons">
                <CreateTaskModal onCreateTask={onCreateTask}/>
            </div>
        </Toolbar>
    </AppBar>
);

TaskAppBar.propTypes = {
    onCreateTask: PropTypes.func.isRequired,
};

/**
 * TaskCardList component that renders a list of task cards.
 * @param {Object} props
 * @param {Array} props.tasks - Array of task objects to display.
 * @param {Function} props.onCompleteTask - Function to mark a task as complete.
 * @param {string} [props.currentPlayingTaskId] - ID of the currently playing task.
 * @param {Function} props.onStartTask - Function to start a task.
 * @param {number} props.remainingDuration - Remaining duration of the currently playing track.
 * @param {Function} props.setRemainingDuration - Function to update the remaining duration.
 * @param {Function} props.setCurrentPlayingTrack - Function to set the current playing track.
 * @param {Function} props.setFadeOut - Function to set the fade-out state.
 * @returns {JSX.Element} The rendered TaskCardList component.
 */
export const TaskCardList = ({
                                 tasks,
                                 onCompleteTask,
                                 currentPlayingTaskId,
                                 onStartTask,
                                 remainingDuration,
                                 setRemainingDuration,
                                 setCurrentPlayingTrack,
                                 setFadeOut,
                             }) => {
    const {snackbarOpen, snackbarMessage, showSnackbar, setSnackbarOpen} = useSnackbar();
    const {playTrack, pauseTrack, trackEventEmitter} = useSpotifyPlayer();

    /**
     * Handles task actions (starting or completing a task).
     * @param {Object} task - The task object for the action.
     * @returns {Promise<void>}
     */
    const handleTaskAction = async (task) => {
        if (task.isCompleted) return;

        if (currentPlayingTaskId === task.id) {
            pauseTrack();
            const completedTaskName = tasks.find(t => t.id === currentPlayingTaskId).taskName;
            onCompleteTask(currentPlayingTaskId);
            showSnackbar(`Task completed: "${completedTaskName}"`);
            setFadeOut(true);
        }

        if (currentPlayingTaskId !== task.id) {
            await playTrack(task.track.uri);
            onStartTask(task.id);
            showSnackbar(`Task started: "${task.taskName}"`);
        }
    };

    useEffect(() => {
        const handleTrackEnded = () => {
            if (currentPlayingTaskId) {
                const completedTask = tasks.find(task => task.id === currentPlayingTaskId);
                if (completedTask) {
                    pauseTrack();
                    onCompleteTask(currentPlayingTaskId);
                    showSnackbar(`Task completed: "${completedTask.taskName}"`);
                    setFadeOut(true);
                }
            }
        };

        const handleTrackStarted = () => {
            if (currentPlayingTaskId) {
                const startedTask = tasks.find(task => task.id === currentPlayingTaskId);
                if (startedTask) {
                    setCurrentPlayingTrack(startedTask.track);
                    setRemainingDuration(startedTask.track.duration_ms);
                }
            }
        };

        trackEventEmitter.on("trackEnded", handleTrackEnded);
        trackEventEmitter.on("trackStarted", handleTrackStarted);

        return () => {
            trackEventEmitter.off("trackEnded", handleTrackEnded);
            trackEventEmitter.off("trackStarted", handleTrackStarted);
        };
    }, [currentPlayingTaskId, onCompleteTask, showSnackbar, tasks, trackEventEmitter]);

    useEffect(() => {
        let countdownInterval;
        let fadeOutTimer;

        if (remainingDuration > 0 && currentPlayingTaskId) {
            countdownInterval = setInterval(() => {
                setRemainingDuration(prevDuration => Math.max(prevDuration - 1000, 0));
            }, 1000);

            const fadeOutTime = remainingDuration > 2000 ? remainingDuration - 2000 : remainingDuration / 2;
            fadeOutTimer = setTimeout(() => {
                setFadeOut(true);
            }, fadeOutTime);
        }

        return () => {
            clearInterval(countdownInterval);
            clearTimeout(fadeOutTimer);
        };
    }, [remainingDuration, currentPlayingTaskId, setRemainingDuration, setFadeOut]);

    return (
        <Box className="task-list-content">
            {tasks.length === 0 ? (
                <Box className="task-list-empty">
                    <Inbox className="empty-icon"/>
                    <Typography variant="h6" className="empty-message">
                        No tasks available
                    </Typography>
                </Box>
            ) : (
                tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onClick={() => handleTaskAction(task)}
                        isPlaying={currentPlayingTaskId === task.id && !task.isCompleted}
                        isCompleted={task.isCompleted}
                        remainingDuration={currentPlayingTaskId === task.id ? remainingDuration : null}
                        isDisabled={currentPlayingTaskId && currentPlayingTaskId !== task.id}
                    />
                ))
            )}
            <SnackbarMessage open={snackbarOpen} onClose={() => setSnackbarOpen(false)} message={snackbarMessage}/>
        </Box>
    );
};

TaskCardList.propTypes = {
    tasks: PropTypes.arrayOf(
        PropTypes.exact({
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
    ).isRequired,
    onCompleteTask: PropTypes.func.isRequired,
    currentPlayingTaskId: PropTypes.string,
    onStartTask: PropTypes.func.isRequired,
    remainingDuration: PropTypes.number.isRequired,
    setRemainingDuration: PropTypes.func.isRequired,
    setCurrentPlayingTrack: PropTypes.func.isRequired,
    setFadeOut: PropTypes.func.isRequired,
};

/**
 * Main TaskList component that manages tasks and their states.
 *
 * @param {Object} props - The props for the TaskList component.
 * @param {Function} props.setCurrentPlayingTrack - Function to set the current playing track.
 * @param {Function} props.setFadeOut - Function to set the fade-out state.
 * @param {Array} [props.tasks] - Optional array of tasks to initialize the task list. Defaults to an empty array if not provided.
 *
 * @returns {JSX.Element} The rendered TaskList component.
 */
const TaskList = ({
                      setCurrentPlayingTrack,
                      setFadeOut,
                      tasks: initialTasks = []
                  }) => {
    const [tasks, setTasks] = useState(initialTasks);
    const [currentPlayingTaskId, setCurrentPlayingTaskId] = useState(null);
    const [completedTaskIds, setCompletedTaskIds] = useState([]);
    const [remainingDuration, setRemainingDuration] = useState(0);

    useEffect(() => {
        const completedTasks = initialTasks.filter((task) => task.isCompleted);
        const completedTaskIds = completedTasks.map((task) => task.id);
        setCompletedTaskIds(completedTaskIds);  // Set initial state for completed tasks
    }, []);

    /**
     * Marks a task as complete.
     * @param {string} taskId - The ID of the task to be marked as completed.
     */
    const handleCompleteTask = (taskId) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId ? {...task, isCompleted: true} : task
            )
        );
        setCurrentPlayingTaskId((current) => (current === taskId ? null : current));
        setCompletedTaskIds((prevCompletedIds) => [...prevCompletedIds, taskId]);
        setRemainingDuration(0);
    };

    /**
     * Starts a task.
     * @param {string} taskId - The ID of the task to be started.
     */
    const handleStartTask = (taskId) => {
        setCurrentPlayingTaskId(taskId);
    };

    /**
     * Creates a new task and adds it to the task list.
     * @param {string} taskName - The name of the task.
     * @param {Object} emoji - The emoji object for the task.
     * @param {Object} track - The track object associated with the task.
     */
    const handleCreateTask = (taskName, emoji, track) => {
        const newTask = {
            id: uuidv4(),
            taskName: taskName,
            emoji: emoji.emoji,
            track: {
                name: track.name,
                uri: track.uri,
                artistsDisplayName: formatArtists(track.artists),
                duration_ms: track.duration_ms,
                image: track.album.images[2].url,
            },
            isCompleted: false,
        };
        setTasks((prevTasks) => [...prevTasks, newTask]);
    };

    const incompleteTasks = tasks.filter((task) => !task.isCompleted);
    const completedTasks = completedTaskIds
        .map((taskId) => tasks.find((task) => task.id === taskId))
        .filter((task) => task);

    // Sort tasks to prioritize the current playing task
    const sortedTasks = [
        ...incompleteTasks.filter((task) => task.id === currentPlayingTaskId),
        ...incompleteTasks.filter((task) => task.id !== currentPlayingTaskId),
        ...completedTasks,
    ];

    return (
        <Box className="task-list-container">
            <TaskAppBar onCreateTask={handleCreateTask}/>
            <TaskCardList
                tasks={sortedTasks}
                onCompleteTask={handleCompleteTask}
                currentPlayingTaskId={currentPlayingTaskId}
                onStartTask={handleStartTask}
                remainingDuration={remainingDuration}
                setRemainingDuration={setRemainingDuration}
                setCurrentPlayingTrack={setCurrentPlayingTrack}
                setFadeOut={setFadeOut}
            />
        </Box>
    );
};

TaskList.propTypes = {
    setCurrentPlayingTrack: PropTypes.func.isRequired,
    setFadeOut: PropTypes.func.isRequired,
    tasks: PropTypes.array,
};

export default TaskList;