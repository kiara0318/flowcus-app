import React, {useEffect, useState} from "react";
import {TaskCard} from "../components";

export default {
    title: "Components/TaskCard",
    component: TaskCard,
};

const Template = (args) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [remainingDuration, setRemainingDuration] = useState(10000);

    // Update the remaining duration every second while the task is playing
    useEffect(() => {
        let interval;
        if (isPlaying && remainingDuration > 0) {
            interval = setInterval(() => {
                setRemainingDuration((prevDuration) => {
                    if (prevDuration <= 1000) {
                        clearInterval(interval);
                        setIsPlaying(false);
                        setIsCompleted(true);
                        return 0;
                    }
                    return prevDuration - 1000;
                });
            }, 1000);
        } else if (!isPlaying && remainingDuration === 0) {
            setRemainingDuration(10000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, remainingDuration]);

    const handlePlayClick = () => {
        if (isPlaying) {
            setIsPlaying(false);
            setIsCompleted(true);
        } else {
            setIsPlaying(true);
        }
    };

    return (
        <TaskCard
            {...args}
            isPlaying={isPlaying}
            isCompleted={isCompleted}
            onClick={handlePlayClick}
            remainingDuration={remainingDuration}
        />
    );
};

export const Default = Template.bind({});
Default.args = {
    task: {
        id: "1",
        taskName: "Sample Task",
        emoji: "📝",
        track: {
            name: "Sample Track",
            uri: "sample-uri",
            duration_ms: 10000,
            artistsDisplayName: "Sample Artist",
            image: "sample-image-url",
        },
        isCompleted: false,
    },
    isDisabled: false,
    remainingDuration: 10000,
};
