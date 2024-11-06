import React, {useState} from "react";
import {TaskCard} from "../components";

export default {
    title: "Components/TaskCard",
    component: TaskCard,
};

const Template = (args) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

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
            onPlay={handlePlayClick}
        />
    );
};

export const Default = Template.bind({});
Default.args = {
    emoji: "📝",
    name: "Sample Task",
    isDisabled: false,
};