import React, {useCallback, useEffect, useRef, useState} from "react";
import PropTypes from "prop-types";
import {AppBar, Box, debounce, Toolbar, Typography} from "@mui/material";
import "./styles/TaskList.css";
import {CreateTaskModal, SnackbarMessage, TaskCard} from "./index";
import {useSnackbar} from "../utils/hooks";
import {Inbox} from "@mui/icons-material";
import {useSpotifyPlayer} from "../context";
import {v4 as uuidv4} from "uuid";
import {formatArtists} from "../utils";

/**
 * TaskAppBar component renders the top navigation bar for the task management interface.
 * It includes the application title and a button to create new tasks within a modal.
 *
 * @component
 * @param {Object} props - The component props
 * @param {Function} props.onCreateTask - Callback function to handle the creation of a new task.
 * @returns {JSX.Element} The rendered component.
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

/**
 * TaskCardList component renders a list of tasks and manages playback, completion,
 * and task tracking functionality with integration to Spotify.
 *
 * @param {Object} props - Component properties
 * @param {Array} props.tasks - List of task objects to display
 * @param {Function} props.onCompleteTask - Callback function to mark a task as complete
 * @param {String|null} props.currentPlayingTaskId - ID of the currently playing task, if any
 * @param {Function} props.onStartTask - Callback function to start a task
 * @param {Number} props.remainingDuration - Remaining duration of the current task in milliseconds
 * @param {Function} props.setRemainingDuration - Setter for remaining duration
 * @param {Function} props.setCurrentPlayingTrack - Setter for the currently playing track
 * @param {Function} props.setFadeOut - Setter for the fade-out effect
 * @param {Set<String>} props.completedTaskIds - Set of IDs for completed tasks
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
                                 completedTaskIds, // Include completedTaskIds to filter out completed tasks
                             }) => {
    const {snackbarOpen, snackbarMessage, showSnackbar, setSnackbarOpen} = useSnackbar();
    const {playTrack, pauseTrack, trackEventEmitter, isSpotifyReady, isPaused} = useSpotifyPlayer();
    const [processingEvent, setProcessingEvent] = useState(false);

    const tasksRef = useRef(tasks);
    const listenersAttachedRef = useRef(false);
    const currentPlayingTaskIdRef = useRef(null);
    const currentPlayingTrackRef = useRef(null);

    /**
     * Switches the currently playing task and handles pausing the previous task if necessary.
     *
     * @param {Object} task - The task to start playing
     * @returns {Promise<void>} - Resolves once the task playback starts
     */
    const switchTask = async (task) => {
        if (currentPlayingTaskIdRef.current !== task.id) {
            // If there's an active task and it's not paused, pause it
            if (currentPlayingTaskIdRef.current && !isPaused) {
                pauseTrack();
                showSnackbar(`Task paused: "${tasksRef.current.find((t) => t.id === currentPlayingTaskIdRef.current)?.taskName}"`);
                await new Promise((resolve) => {
                    const checkPaused = () => {
                        if (isPaused) resolve();
                    };
                    checkPaused(); // Check immediately if paused
                    trackEventEmitter.once("trackEnded", checkPaused);
                });
            }

            // Play the new task
            await playTrack(task.track.uri);
            onStartTask(task.id);
            currentPlayingTaskIdRef.current = task.id;
            showSnackbar(`Task started: "${task.taskName}"`);
        }
    };

    /**
     * Handles the task action, either pausing and completing the current task, or switching to a new task.
     *
     * @param {Object} task - The task to handle
     * @returns {Promise<void>} - Resolves once the action is complete
     */
    const handleTaskAction = useCallback(
        async (task) => {
            // If task is completed or already marked as completed, do nothing
            if (task.isCompleted || completedTaskIds.has(task.id)) return;

            // Handle task playback or completion
            if (currentPlayingTaskIdRef.current === task.id) {
                pauseTrack();
                onCompleteTask(task.id);
                showSnackbar(`Task paused: "${task.taskName}"`);
                setFadeOut(true);
            } else {
                await switchTask(task);
            }
        },
        [completedTaskIds, currentPlayingTaskIdRef, pauseTrack, showSnackbar, setFadeOut, onCompleteTask]
    );

    /**
     * Handles the event when a track starts, updating the UI with the current track and its remaining duration.
     */
    const handleTrackStarted = useCallback(
        debounce(() => {
            if (processingEvent) return;
            setProcessingEvent(true);

            const startedTask = tasksRef.current.find((task) => task.id === currentPlayingTaskIdRef.current);

            if (startedTask && !completedTaskIds.has(startedTask.id)) {
                if (currentPlayingTrackRef.current !== startedTask.track.uri) {
                    currentPlayingTrackRef.current = startedTask.track.uri;
                    setCurrentPlayingTrack(startedTask.track);
                    setRemainingDuration(startedTask.track.duration_ms);
                }
            }

            setProcessingEvent(false);
        }, 300),
        [processingEvent, setCurrentPlayingTrack, setRemainingDuration]
    );

    /**
     * Handles the event when a track ends, marking the current task as completed and pausing the track.
     */
    const handleTrackEnded = useCallback(
        debounce(() => {
            const completedTask = tasksRef.current.find(
                (task) => task.id === currentPlayingTaskIdRef.current
            );

            if (completedTask && !completedTaskIds.has(completedTask.id)) {
                pauseTrack();
                onCompleteTask(currentPlayingTaskIdRef.current);
                showSnackbar(`Task completed: "${completedTask.taskName}"`);
                setFadeOut(true);

                // Clear currentPlayingTaskIdRef to avoid playback issues
                currentPlayingTaskIdRef.current = null;
            }
        }, 300),
        [onCompleteTask, showSnackbar, setFadeOut, pauseTrack]
    );

    useEffect(() => {
        const removeEventListeners = () => {
            if (trackEventEmitter && listenersAttachedRef.current) {
                trackEventEmitter.off("trackEnded", handleTrackEnded);
                trackEventEmitter.off("trackStarted", handleTrackStarted);
                listenersAttachedRef.current = false;
            }
        };

        if (isSpotifyReady && trackEventEmitter && !listenersAttachedRef.current) {
            trackEventEmitter.on("trackEnded", handleTrackEnded);
            trackEventEmitter.on("trackStarted", handleTrackStarted);
            listenersAttachedRef.current = true;
        }

        return () => removeEventListeners();
    }, [isSpotifyReady, trackEventEmitter, handleTrackStarted, handleTrackEnded]);

    useEffect(() => {
        tasksRef.current = tasks;
    }, [tasks]);

    useEffect(() => {
        let countdownInterval;
        if (remainingDuration > 0 && currentPlayingTaskIdRef.current) {
            countdownInterval = setInterval(() => {
                setRemainingDuration((prevDuration) => Math.max(prevDuration - 1000, 0));
            }, 1000);
        }
        return () => clearInterval(countdownInterval);
    }, [remainingDuration]);

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
                        isDisabled={task.isCompleted || (currentPlayingTaskId && currentPlayingTaskId !== task.id)}
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
        }).isRequired
    ).isRequired,
    onCompleteTask: PropTypes.func.isRequired,
    currentPlayingTaskId: PropTypes.string,
    onStartTask: PropTypes.func.isRequired,
    remainingDuration: PropTypes.number.isRequired,
    setRemainingDuration: PropTypes.func.isRequired,
    setCurrentPlayingTrack: PropTypes.func.isRequired,
    setFadeOut: PropTypes.func.isRequired,
    completedTaskIds: PropTypes.instanceOf(Set).isRequired,
};

/**
 * TaskList Component
 *
 * Manages a list of tasks, supporting task creation, completion, and playback functionality.
 * Tasks are sorted to prioritize the currently playing task, followed by incomplete and completed tasks.
 *
 * @param {Object} props - Component properties
 * @param {function} props.setCurrentPlayingTrack - Callback to set the currently playing track
 * @param {function} props.setFadeOut - Callback to trigger fade-out effect when a task is completed
 * @param {Array} [props.tasks=[]] - Initial list of tasks to display
 * @returns {JSX.Element} Rendered TaskList component
 */
const TaskList = ({
                      setCurrentPlayingTrack,
                      setFadeOut,
                      tasks: initialTasks = [],
                  }) => {
    const [tasks, setTasks] = useState(initialTasks);
    const [currentPlayingTaskId, setCurrentPlayingTaskId] = useState(null);
    const [completedTaskIds, setCompletedTaskIds] = useState(new Set());
    const [remainingDuration, setRemainingDuration] = useState(0);

    useEffect(() => {
        const completedTasks = initialTasks.filter((task) => task.isCompleted);
        setCompletedTaskIds(new Set(completedTasks.map((task) => task.id)));
    }, []);

    /**
     * Marks a task as completed.
     *
     * @param {string} taskId - ID of the task to mark as completed
     */
    const handleCompleteTask = (taskId) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId ? {...task, isCompleted: true} : task
            )
        );
        setCurrentPlayingTaskId((current) => (current === taskId ? null : current));
        setCompletedTaskIds((prevCompletedIds) => new Set(prevCompletedIds).add(taskId));
        setRemainingDuration(0);
    };

    /**
     * Starts a task by setting it as the currently playing task.
     *
     * @param {string} taskId - ID of the task to start
     */
    const handleStartTask = (taskId) => {
        setCurrentPlayingTaskId(taskId);
    };

    /**
     * Creates a new task and adds it to the task list.
     *
     * @param {string} taskName - Name of the task
     * @param {Object} emoji - Emoji associated with the task
     * @param {Object} track - Track information for the task
     */
    const handleCreateTask = (taskName, emoji, track) => {
        const newTask = {
            id: uuidv4(),
            taskName,
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
    const completedTasks = Array.from(completedTaskIds)
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
            {/* TaskAppBar component for creating new tasks */}
            <TaskAppBar onCreateTask={handleCreateTask}/>
            {/* TaskCardList displays sorted tasks and handles task actions */}
            <TaskCardList
                tasks={sortedTasks}
                onCompleteTask={handleCompleteTask}
                currentPlayingTaskId={currentPlayingTaskId}
                onStartTask={handleStartTask}
                remainingDuration={remainingDuration}
                setRemainingDuration={setRemainingDuration}
                setCurrentPlayingTrack={setCurrentPlayingTrack}
                setFadeOut={setFadeOut}
                completedTaskIds={completedTaskIds}
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