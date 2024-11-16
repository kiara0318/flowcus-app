import React from "react";
import {TaskList} from "../components";
import {v4 as uuidv4} from "uuid";
import {SpotifyPlayerContext} from "../context";
import PropTypes from "prop-types";

// Mock data for tasks
const mockTasks = [
    {
        id: uuidv4(),
        taskName: "Task 1",
        emoji: "🎧",
        track: {
            name: "Track 1",
            uri: "spotify:track:1",
            artistsDisplayName: "Artist 1",
            duration_ms: 180000,
            image: "https://via.placeholder.com/150",
        },
        isCompleted: false,
    },
    {
        id: uuidv4(),
        taskName: "Task 2",
        emoji: "🎶",
        track: {
            name: "Track 2",
            uri: "spotify:track:2",
            artistsDisplayName: "Artist 2",
            duration_ms: 200000,
            image: "https://via.placeholder.com/150",
        },
        isCompleted: false,
    },
];

const MockSpotifyPlayerContext = ({children}) => {
    const mockSpotifyPlayer = {
        playTrack: (uri) => {
            console.log(`Mock playing track with URI: ${uri}`);
        },
        pauseTrack: () => {
            console.log("Mock track paused");
        },
        currentTrack: null,
        setCurrentTrack: (track) => {
            console.log("Mock setting current track:", track);
        },
        trackEventEmitter: {
            on: (event) => {
                console.log(`Event listener added for ${event}`);
            },
            off: (event) => {
                console.log(`Event listener removed for ${event}`);
            },
        },
    };

    return (
        <SpotifyPlayerContext.Provider value={mockSpotifyPlayer}>
            {children}
        </SpotifyPlayerContext.Provider>
    );
};

MockSpotifyPlayerContext.propTypes = {
    children: PropTypes.node,
};

export default {
    title: "Components/TaskList",
    component: TaskList,
};


const Template = (args) => (
    <MockSpotifyPlayerContext>
        <TaskList {...args} />
    </MockSpotifyPlayerContext>
);

export const Default = Template.bind({});
Default.args = {
    tasks: mockTasks,  // Pass mock tasks as the default prop
    setCurrentPlayingTrack: (track) => console.log("Playing track:", track),
    setFadeOut: (fadeOut) => console.log("Fade out:", fadeOut),
};

export const NoTasks = Template.bind({});
NoTasks.args = {
    tasks: [],
    setCurrentPlayingTrack: (track) => console.log("Playing track:", track),
    setFadeOut: (fadeOut) => console.log("Fade out:", fadeOut),
};

export const WithCompletedTasks = Template.bind({});
WithCompletedTasks.args = {
    tasks: [
        ...mockTasks,
        {
            id: uuidv4(),
            taskName: "Completed Task",
            emoji: "✅",
            track: {
                name: "Completed Track",
                uri: "spotify:track:completed",
                artistsDisplayName: "Artist Completed",
                duration_ms: 150000,
                image: "https://via.placeholder.com/150",
            },
            isCompleted: true,
        },
    ],
    setCurrentPlayingTrack: (track) => console.log("Playing track:", track),
    setFadeOut: (fadeOut) => console.log("Fade out:", fadeOut),
};