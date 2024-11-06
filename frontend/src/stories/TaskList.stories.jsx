import React, {useState} from "react";
import {TaskList} from "../components"; // Adjust the path as necessary

export default {
    title: "Components/TaskList",
    component: TaskList,
};

const Template = (args) => {
    const [completedTaskIds, setCompletedTaskIds] = useState([]);
    const [, setCurrentPlayingTask] = useState(null);

    const tasks = [
        {id: 1, name: "Task 1", emoji: "🎵"},
        {id: 2, name: "Task 2", emoji: "🎤"},
        {id: 3, name: "Task 3", emoji: "🎧"},
    ];

    const handleCompleteTask = (id) => {
        setCompletedTaskIds((prevIds) => [...prevIds, id]);
        setCurrentPlayingTask(null);
    };

    return (
        <TaskList
            tasks={tasks}
            completedTaskIds={completedTaskIds}
            onCompleteTask={handleCompleteTask}
            {...args}
        />
    );
};

export const Default = Template.bind({});
Default.args = {};
