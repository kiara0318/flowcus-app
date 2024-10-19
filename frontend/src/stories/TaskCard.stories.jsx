// TaskCard.stories.jsx

import React from "react";
import {TaskCard} from "../components";
import {convertUnifiedToEmoji} from "../utils";

export default {
    title: "Components/TaskCard", component: TaskCard, argTypes: {
        emoji: {control: "text"}, name: {control: "text"}
    },
};

const Template = (args) => <TaskCard {...args} />;

export const Default = Template.bind({});
Default.args = {
    name: "Complete one item on task list"
};

export const UrgentTask = Template.bind({});
UrgentTask.args = {
    emoji: "⚠️", name: "Pay Rent"
};

export const CasualTask = Template.bind({});
CasualTask.args = {
    emoji: "☕", name: "Take a coffee break"
};

export const UnicodeToToothbrushEmoji = Template.bind({});
UnicodeToToothbrushEmoji.args = {
    emoji: convertUnifiedToEmoji("1faa5"), name: "Brush your teeth"
};

