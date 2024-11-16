import React from "react";
import {SpotifyPlayerContext} from "../context";
import {TaskList} from "../components";
import PropTypes from "prop-types";

// Mock the SpotifyPlayerContext for Storybook
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
            once: (event, callback) => {
                console.log(`Once event listener added for ${event}`);
                if (callback) callback(); // Immediately trigger the callback
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

// Storybook configuration
export default {
    title: "Components/TaskList",
    component: TaskList,
    decorators: [
        (Story) => (
            <MockSpotifyPlayerContext>
                <Story/>
            </MockSpotifyPlayerContext>
        ),
    ],
};

// Template function for rendering the TaskList component
const Template = (args) => <TaskList {...args} />;

// Default example with populated tasks
export const Default = Template.bind({});
Default.args = {
    setCurrentPlayingTrack: (track) => console.log("Current track set:", track),
    setFadeOut: () => console.log("Fade-out triggered"),
    tasks: [
        {
            id: "1",
            taskName: "Task 1",
            emoji: "🔥",
            track: {
                name: "Track 1",
                uri: "spotify:track:1",
                artistsDisplayName: "Artist 1",
                duration_ms: 180000,
                image: "image-url",
            },
            isCompleted: false,
        },
        {
            id: "2",
            taskName: "Task 2",
            emoji: "🎵",
            track: {
                name: "Track 2",
                uri: "spotify:track:2",
                artistsDisplayName: "Artist 2",
                duration_ms: 200000,
                image: "image-url",
            },
            isCompleted: true,
        },
    ],
};

// Example with no tasks
export const WithEmptyTasks = Template.bind({});
WithEmptyTasks.args = {
    setCurrentPlayingTrack: (track) => console.log("Current track set:", track),
    setFadeOut: () => console.log("Fade-out triggered"),
    tasks: [],
};